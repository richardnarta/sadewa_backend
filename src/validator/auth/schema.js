const Joi = require('joi');

const LoginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().pattern(
    new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$')
  ).required(),
});

const ForgetPasswordPayloadSchema = Joi.object({
  user_email: Joi.string().pattern(
    new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
  ).required()
});

const VerificationForgetPasswordPayloadSchema = Joi.object({
  user_email: Joi.string().pattern(
    new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
  ).required(),
  OTP: Joi.number().required(),
});

module.exports = { 
  LoginPayloadSchema,
  ForgetPasswordPayloadSchema,
  VerificationForgetPasswordPayloadSchema,
};