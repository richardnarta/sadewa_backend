const InvariantError = require('../../exceptions/invariant-error');
const { 
  ConfigureSensorPayloadSchema,
  ConfigureSensorParamSchema,
  ConfigureFeederPayloadSchema,
  ConfigureAeratorPayloadSchema
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

  validateFeederConfigurationPayload: (payload) => {
    const validationResult = ConfigureFeederPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateAeratorConfigurationPayload: (payload) => {
    const validationResult = ConfigureAeratorPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ConfigurationValidator;