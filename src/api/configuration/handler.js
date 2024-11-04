class ConfigurationHandler {
  constructor(service, validator) {
    this._configurationService = service.configuration;
    this._validator = validator;

    this.getSensorConfigurationHandler = this.getSensorConfigurationHandler.bind(this);
    this.getSensorConfigurationByIdHandler = this.getSensorConfigurationByIdHandler.bind(this);
    this.getSensorStartHandler = this.getSensorStartHandler.bind(this);
    this.getSensorStopHandler = this.getSensorStopHandler.bind(this);
    this.putSensorConfigurationHandler = this.putSensorConfigurationHandler.bind(this);
    this.getActuatorConfigurationHandler = this.getActuatorConfigurationHandler.bind(this);
    this.putFeederScheduleHandler = this.putFeederScheduleHandler.bind(this);
    this.putAeratorScheduleHandler = this.putAeratorScheduleHandler.bind(this);
  }

  async getSensorConfigurationHandler(request, h) {
    const sensorData = await this._configurationService.getAllSensorConfiguration();

    return h.response({
      error: false,
      data: sensorData
    }).code(200);
  }

  async getSensorConfigurationByIdHandler(request, h) {
    this._validator.validateSensorParam(request.params);

    const { sensorId } = request.params;

    const sensorData = await this._configurationService.getSensorConfigurationById(sensorId);

    return h.response({
      error: false,
      data: sensorData
    }).code(200);
  }

  async getSensorStartHandler(request, h) {
    this._validator.validateSensorParam(request.params);

    const { sensorId } = request.params;

    const result = await this._configurationService.startSensor(sensorId);

    return h.response({
      error: false,
      message: `Berhasil mengaktifkan sensor ${result}`
    }).code(200);
  }

  async getSensorStopHandler(request, h) {
    this._validator.validateSensorParam(request.params);

    const { sensorId } = request.params;

    const result = await this._configurationService.stopSensor(sensorId);

    return h.response({
      error: false,
      message: `Berhasil menonaktifkan sensor ${result}`
    }).code(200);
  }

  async putSensorConfigurationHandler(request, h) {
    this._validator.validateSensorParam(request.params);
    this._validator.validateSensorConfigurationPayload(request.payload);

    const { sensorId } = request.params;

    const { max, min } = request.payload;

    const result = await this._configurationService
    .changeSensorConfiguration(sensorId, max, min);

    return h.response({
      error: false,
      message: `Berhasil mengubah parameter ${result} air tambak udang`
    }).code(200);
  }

  async getActuatorConfigurationHandler(request, h) {
    const data = await this._configurationService.getAllActuatorConfiguration();

    return h.response({
      error: false,
      data: data
    }).code(200);
  }

  async putFeederScheduleHandler(request, h) {
    this._validator.validateFeederConfigurationPayload(request.payload);

    const payload = request.payload;

    await this._configurationService.changeFeederConfiguration(payload);

    return h.response({
      error: false,
      message: "Berhasil mengubah jadwal pemberian pakan"
    }).code(200);
  }

  async putAeratorScheduleHandler(request, h) {
    this._validator.validateAeratorConfigurationPayload(request.payload);

    const payload = request.payload;

    await this._configurationService.changeAeratorConfiguration(payload);

    return h.response({
      error: false,
      message: "Berhasil mengubah jadwal kincir air"
    }).code(200);
  }
}

module.exports = ConfigurationHandler;