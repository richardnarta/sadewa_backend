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
}

module.exports = FirebaseService;