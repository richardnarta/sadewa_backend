const { db, message } = require('../../config/firebase-config');
const { generateNotification } = require('../utils/notification');
const { getNotificationTokenAndId } = require('../utils/jwt');
const { getAvailableJWT } = require('../utils/redis');
const InternalServerError = require('../exceptions/internal-server-error');

class FirebaseService {
  constructor(notificationService) {
    this._db = db;
    this._messaging = message;
    this._notificationService = notificationService;
  }

  async getSensorThreshold(sensor) {
    let result = {};

    let ref = this._db.ref(`thresholds/${sensor}High`);

    let snapshot = await ref.once('value');
    result.max = snapshot.val();

    ref = this._db.ref(`thresholds/${sensor}Low`);

    snapshot = await ref.once('value');
    result.min = snapshot.val();
    
    return result;
  }

  async getSensorStatus(sensor) {
    if (sensor == 'salinity') {
      sensor = 'salinitas';
    } else if (sensor == 'temperature') {
      sensor = 'suhu'
    }

    const ref = this._db.ref(`status_sensor/${sensor}`);

    return (await ref.once('value')).val();
  }

  async updateSensorStatus(sensor, value) {
    const ref = this._db.ref('status_sensor');
    let newStatus = null;

    switch (sensor) {
      case 'temperature':
        newStatus = { suhu: value };
        break;
      case 'ph':
        newStatus = { ph: value };
        break;
      case 'salinity':
        newStatus = { salinitas: value };
        break;
      case 'turbidity':
        newStatus = { turbidity: value };
        break;
    }

    if (ref !== null && newStatus !== null) {
      await ref.update(newStatus, (error) => {
        if (error) {
          throw new InternalServerError('Terjadi kesalahan, silahkan coba lagi');
        }
      });
    }
  }

  async updateSensorThreshold(value) {
    const ref = this._db.ref('thresholds');

    await ref.update(value, (error) => {
      if (error) {
        throw new InternalServerError('Terjadi kesalahan, silahkan coba lagi');
      }
    });
  }

  async getActutorData() {
    const data = {}

    let ref = this._db.ref('feeding_schedule');

    let snapshot = await ref.once('value');
    data.feeder = {
      feeder_status: await this.getFeederStatus(),
      schedule_1: snapshot.val().schedule_1,
      schedule_2: snapshot.val().schedule_2,
      schedule_3: snapshot.val().schedule_3,
      schedule_4: snapshot.val().schedule_4,
    }

    ref = this._db.ref('aerator');
    
    snapshot = await ref.once('value');
    data.aerator = {
      off_minutes_before: snapshot.val().aeratorOffMinutesBefore,
      on_minutes_after: snapshot.val().aeratorOnMinutesAfter
    }

    return data;
  }

  async getFeederStatus() {
    const ref = this._db.ref('isi_pakan');

    const snapshot = await ref.once('value');

    return snapshot.val();
  }

  async setFeederSchedule(schedule, data) {
    const ref = this._db.ref(`feeding_schedule/${schedule}`);

    await ref.update(data, (error) => {
      if (error) {
        throw new InternalServerError('Terjadi kesalahan, silahkan coba lagi');
      }
    });
  }

  async setAeratorSchedule(data) {
    const ref = this._db.ref('aerator');

    await ref.update(data, (error) => {
      if (error) {
        throw new InternalServerError('Terjadi kesalahan, silahkan coba lagi');
      }
    });
  }

  async sendNotification(title, body, level, first = false) {
    if (first) {
      return;
    }

    let tokens = await getAvailableJWT();

    if (tokens.length > 0) {
      const userId = [];
      const notificationTokens = await Promise.all(
        tokens.map(async (key) => {
          const data = await getNotificationTokenAndId(key);

          userId.push(data.id);

          return data.notification;
        })
      );

      await this._notificationService.createNotification(
        title, 
        body, 
        level, 
        userId
      )

      const messages = generateNotification(
        title, body, notificationTokens);

      try {
        await this._messaging.sendEach(messages);
      } catch (error) {
        console.log(error);
      }
    }
  }

  listenToFeederStatus() {
    const ref = this._db.ref('isi_pakan');
    let first = true;

    ref.on('value', async (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        await this.sendNotification(
          '[Peringatan] Pakan Ternak Otomatis', 
          `Jumlah pakan sudah habis. Mohon untuk segera mengisinya kembali.\n`,
          'high',
          first
        );
      }

      first = false;
    });
  }

  listenToSensorStatus() {
    let firstTemperature = true;

    this._db.ref('status_sensor/suhu').on(
      'value', async(snapshot) => {
        const sensorStatus = snapshot.val();
        if (sensorStatus) {
          await this.sendNotification(
            '[Pemberitahuan] Sensor Suhu', 
            `Sensor suhu berhasil diaktifkan.\n`,
            'low',
            firstTemperature
          );
        } else {
          await this.sendNotification(
            '[Pemberitahuan] Sensor Suhu', 
            `Sensor suhu berhasil dinonaktifkan.\n`,
            'medium',
            firstTemperature
          );
        }

        firstTemperature = false;
    });

    let firstPH = true;

    this._db.ref('status_sensor/ph').on(
      'value', async(snapshot) => {
        const sensorStatus = snapshot.val();

        if (sensorStatus) {
          await this.sendNotification(
            '[Pemberitahuan] Sensor PH', 
            `Sensor PH berhasil diaktifkan.\n`,
            'low',
            firstPH
          );
        } else {
          await this.sendNotification(
            '[Pemberitahuan] Sensor PH', 
            `Sensor PH berhasil dinonaktifkan.\n`,
            'medium',
            firstPH
          );
        }

        firstPH = false;
    });

    let firstSalinity = true;

    this._db.ref('status_sensor/salinitas').on(
      'value', async(snapshot) => {
        const sensorStatus = snapshot.val();

        if (sensorStatus) {
          await this.sendNotification(
            '[Pemberitahuan] Sensor Salinitas', 
            `Sensor salinitas berhasil diaktifkan.\n`,
            'low',
            firstSalinity
          );
        } else {
          await this.sendNotification(
            '[Pemberitahuan] Sensor Salinitas', 
            `Sensor salinitas berhasil dinonaktifkan.\n`,
            'medium',
            firstSalinity
          );
        }

        firstSalinity = false;
    });

    let firstTurbidity = true;

    this._db.ref('status_sensor/turbidity').on(
      'value', async(snapshot) => {
        const sensorStatus = snapshot.val();

        if (sensorStatus) {
          await this.sendNotification(
            '[Pemberitahuan] Sensor Kekeruhan', 
            `Sensor kekeruhan berhasil diaktifkan.\n`,
            'low',
            firstTurbidity
          );
        } else {
          await this.sendNotification(
            '[Pemberitahuan] Sensor Kekeruhan', 
            `Sensor kekeruhan berhasil dinonaktifkan.\n`,
            'medium',
            firstTurbidity
          );
        }

        firstTurbidity = false;
    });
  }

  listenToSensorConfiguration() {
    let firstTemperature = true;

    this._db.ref('sensorData/temperature').on(
      'value', async(snapshot) => {
        const dataTemperature = snapshot.val();
        const threshold = await this.getSensorThreshold(
          'temperature');

        if (
          dataTemperature < threshold.min ||
          dataTemperature > threshold.max
        ) {
          await this.sendNotification(
            '[Peringatan] Sensor Suhu', 
            `Sensor suhu menunjukkan nilai \
            ${Number(dataTemperature).toFixed(2)}°C yang berada di luar batas wajar.\n`,
            'high',
            firstTemperature
          );
        }

        firstTemperature = false;
    });

    let firstPH = true;

    this._db.ref('sensorData/pH').on(
      'value', async(snapshot) => {
        const dataPH = snapshot.val();
        const threshold = await this.getSensorThreshold(
          'ph');

        if (
          dataPH < threshold.min ||
          dataPH > threshold.max
        ) {
          await this.sendNotification(
            '[Peringatan] Sensor PH', 
            `Sensor PH menunjukkan nilai \
            ${Number(dataPH).toFixed(2)} yang berada di luar batas wajar.\n`,
            'high',
            firstPH
          );
        }

        firstPH = false;
    });

    let firstSalinity = true;

    this._db.ref('sensorData/salinity').on(
      'value', async(snapshot) => {
        const dataSalinity = snapshot.val();
        const threshold = await this.getSensorThreshold(
          'salinity');

        if (
          dataSalinity < threshold.min ||
          dataSalinity > threshold.max
        ) {
          await this.sendNotification(
            '[Peringatan] Sensor Salinitas', 
            `Sensor salinitas menunjukkan nilai \
            ${Number(dataSalinity).toFixed(2)} PPT yang berada di luar batas wajar.\n`,
            'high',
            firstSalinity
          );
        }

        firstSalinity = false;
    });

    let firstTurbidity = true;

    this._db.ref('sensorData/turbidity').on(
      'value', async(snapshot) => {
        const dataTurbidity = snapshot.val();
        const threshold = await this.getSensorThreshold(
          'turbidity');

        if (
          dataTurbidity < threshold.min ||
          dataTurbidity > threshold.max
        ) {
          await this.sendNotification(
            '[Peringatan] Sensor Kekeruhan', 
            `Sensor PH menunjukkan nilai \
            ${Number(dataTurbidity).toFixed(2)} NTU yang berada di luar batas wajar.\n`,
            'high',
            firstTurbidity
          );
        }

        firstTurbidity = false;
    });
  }

  listenToFeederSchedule() {
    let first = true;
    const ref = this._db.ref('feeding_schedule');

    ref.on('value', async(snapshot) => {
      await this.sendNotification(
        '[Pmberitahuan] Pakan Ternak Otomatis', 
        `Jadwal atau jumlah pakan ternak otomatis berhasil diubah\n`,
        'low',
        first
      );

      first = false
    });
  }

  listenToAeratorSchedule() {
    let first = true;
    const ref = this._db.ref('aerator');

    ref.on('value', async(snapshot) => {
      await this.sendNotification(
        '[Pmberitahuan] Kincir Air Otomatis', 
        `Jadwal pengaktifan dan penonaktifan kincir air berhasil diubah\n`,
        'low',
        first
      );

      first = false
    });
  }
}

module.exports = FirebaseService;