const ClientError = require('../exceptions/client-error');

class ConfigurationService {
  constructor(firebaseService) {
    this._firebaseService = firebaseService;
  }

  async getAllSensorConfiguration() {
    const temperature = await this._firebaseService.getSensorThreshold('temperature');
    const pH = await this._firebaseService.getSensorThreshold('pH');
    const salinity = await this._firebaseService.getSensorThreshold('salinity');
    const turbidity = await this._firebaseService.getSensorThreshold('turbidity');

    return {
      max_temperature: temperature.max,
      min_temperature: temperature.min,
      max_ph: pH.max,
      min_pH: pH.min,
      max_salinity: salinity.max,
      min_salinity: salinity.min,
      max_turbidity: turbidity.max,
      min_turbidity: turbidity.min
    }
  }

  async getSensorConfigurationById(sensorId) {
    if (sensorId == 'ph') {
      sensorId = 'pH';
    }

    const sensorData = await this._firebaseService.getSensorThreshold(sensorId);

    if (sensorId == 'pH') {
      sensorId = 'ph';
    }

    return {
      max: sensorData.max,
      min: sensorData.min,
    }
  }

  async startSensor(sensorId) {
    await this._firebaseService.updateSensorStatus(sensorId, true);

    switch (sensorId) {
      case 'temperature':
        return 'suhu';
      case 'ph':
        return 'pH';
      case 'salinity':
        return 'salinitas';
      default:
        return 'kekeruhan';
    }
  }

  async stopSensor(sensorId) {
    await this._firebaseService.updateSensorStatus(sensorId, false);

    switch (sensorId) {
      case 'temperature':
        return 'suhu';
      case 'ph':
        return 'pH';
      case 'salinity':
        return 'salinitas';
      default:
        return 'kekeruhan';
    }
  }

  async changeSensorConfiguration(sensorId, max, min) {
    let newConfiguration = {};

    const oldConfiguration = await this.getSensorConfigurationById(sensorId);

    if (sensorId == 'ph') {
      sensorId = 'pH';
    }

    if (max !== undefined) {
      if (max < oldConfiguration.min) {
        throw new ClientError('Konfigurasi sensor invalid');
      }

      newConfiguration[`${sensorId}High`] = Number(max);
    }

    if (min !== undefined) {
      if (min > oldConfiguration.max) {
        throw new ClientError('Konfigurasi sensor invalid');
      }

      newConfiguration[`${sensorId}Low`] = Number(min);
    }

    await this._firebaseService.updateSensorThreshold(newConfiguration);

    switch (sensorId) {
      case 'temperature':
        return 'suhu';
      case 'pH':
        return 'pH';
      case 'salinity':
        return 'salinitas';
      default:
        return 'kekeruhan';
    }
  }
}

module.exports = ConfigurationService;