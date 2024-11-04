const Joi = require('joi');

const ConfigureSensorPayloadSchema = Joi.object({
  max: Joi.number(),
  min: Joi.number(),
});

const ConfigureSensorParamSchema = Joi.object({
  sensorId: Joi.string().valid('temperature', 'ph', 'salinity', 'turbidity').required()
})

const ConfigureFeederPayloadSchema = Joi.object({
  schedule_1_amount: Joi.number(),
  schedule_2_amount: Joi.number(),
  schedule_3_amount: Joi.number(),
  schedule_4_amount: Joi.number(),
  schedule_1_time: Joi.string().pattern(
    new RegExp('^(?:[01]\\d|2[0-3]):[0-5]\\d$')),
  schedule_2_time: Joi.string().pattern(
    new RegExp('^(?:[01]\\d|2[0-3]):[0-5]\\d$')),
  schedule_3_time: Joi.string().pattern(
    new RegExp('^(?:[01]\\d|2[0-3]):[0-5]\\d$')),
  schedule_4_time: Joi.string().pattern(
    new RegExp('^(?:[01]\\d|2[0-3]):[0-5]\\d$')),
});

const ConfigureAeratorPayloadSchema = Joi.object({
  off_minutes_before: Joi.number(),
  on_minutes_after: Joi.number(),
});

module.exports = { 
  ConfigureSensorPayloadSchema,
  ConfigureSensorParamSchema,
  ConfigureFeederPayloadSchema,
  ConfigureAeratorPayloadSchema,
};