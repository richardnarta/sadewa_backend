const db = require('../../config/firebase-config');
const InternalServerError = require('../exceptions/internal-server-error');

class FirebaseService {
  constructor() {
    this._db = db;
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
}

module.exports = FirebaseService;