const ClientError = require('../exceptions/client-error');

class ConfigurationService {
  constructor(firebaseService) {
    this._firebaseService = firebaseService;
  }

  async getSensorConfigurationById(sensorId) {
    if (sensorId == 'ph') {
      sensorId = 'pH';
    }

    const sensorData = await this._firebaseService.getSensorThreshold(sensorId);

    if (sensorId == 'pH') {
      sensorId = 'ph';
    }

    const sensorStatus = await this._firebaseService.getSensorStatus(sensorId);

    return {
      max: sensorData.max,
      min: sensorData.min,
      status: sensorStatus
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

  async getAllActuatorConfiguration() {
    return await this._firebaseService.getActutorData();
  }

  async changeFeederConfiguration(payloads) {
    const payloadKeys = Object.keys(payloads);

    const uniqueKeys = Array.from(
      new Set(payloadKeys.map(key => { return key.slice(0, 10) }))
    );

    for (const schedule of uniqueKeys) {
      const updatedData = {}
      if (payloads[`${schedule}_time`] != undefined) {
        updatedData.time = payloads[`${schedule}_time`];
      }
      if (payloads[`${schedule}_amount`] != undefined) {
        updatedData.amount = Number(payloads[`${schedule}_amount`]);
      }

      if (Object.keys(payloads).length > 0) {
        await this._firebaseService.setFeederSchedule(schedule, updatedData);
      }
    }
  }

  async changeAeratorConfiguration(payloads) {
    const updatedData = {}

    if (payloads.off_minutes_before != undefined) {
      updatedData.aeratorOffMinutesBefore = Number(payloads.off_minutes_before);
    }

    if (payloads.on_minutes_after != undefined) {
      updatedData.aeratorOnMinutesAfter = Number(payloads.on_minutes_after);
    }

    await this._firebaseService.setAeratorSchedule(updatedData);
  }
}

module.exports = ConfigurationService;