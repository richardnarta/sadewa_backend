const InvariantError = require('../../exceptions/invariant-error');
const { 
  LoginPayloadSchema,
  ForgetPasswordPayloadSchema,
  VerificationForgetPasswordPayloadSchema,
} = require('./schema');

const AuthValidator = {
  validateLoginPayload: (payload) => {
    const validationResult = LoginPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateForgetPasswordPayload: (payload) => {
    const validationResult = ForgetPasswordPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateVerificationForgetPasswordPayload: (payload) => {
    const validationResult = VerificationForgetPasswordPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthValidator;