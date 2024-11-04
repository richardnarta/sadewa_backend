const Joi = require('joi');

const ConfigureSensorPayloadSchema = Joi.object({
  max: Joi.number(),
  min: Joi.number(),
});

const ConfigureSensorParamSchema = Joi.object({
  sensorId: Joi.string().valid('temperature', 'ph', 'salinity', 'turbidity').required()
})

module.exports = { 
  ConfigureSensorPayloadSchema,
  ConfigureSensorParamSchema,
};