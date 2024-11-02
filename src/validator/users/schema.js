const Joi = require('joi');

const RegisterPayloadSchema = Joi.object({
  user_email: Joi.string().pattern(
    new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
  ).required(),
  user_username: Joi.string().required(),
  user_password: Joi.string().pattern(
    new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$')
  ).required(),
  user_name: Joi.string().required(),
  user_type: Joi.string().valid('admin', 'pengelola').required()
});

const VerifyEmailPayloadSchema = Joi.object({
  OTP: Joi.number().required(),
});

const ChangePasswordPayloadSchema = Joi.object({
  new_password: Joi.string().pattern(
    new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$')
  ).required(),
});

module.exports = { 
  RegisterPayloadSchema,
  VerifyEmailPayloadSchema,
  ChangePasswordPayloadSchema,
};