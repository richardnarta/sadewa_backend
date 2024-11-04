const InvariantError = require('../../exceptions/invariant-error');
const { 
  ConfigureSensorPayloadSchema,
  ConfigureSensorParamSchema,
} = require('./schema');

const ConfigurationValidator = {
  validateSensorConfigurationPayload: (payload) => {
    const validationResult = ConfigureSensorPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSensorParam: (params) => {
    const validationResult = ConfigureSensorParamSchema.validate(params);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ConfigurationValidator;