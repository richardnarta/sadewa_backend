const InvariantError = require('../../exceptions/invariant-error');
const { 
  RegisterPayloadSchema,
  VerifyEmailPayloadSchema,
  ChangePasswordPayloadSchema,
} = require('./schema');

const UserValidator = {
  validateRegisterPayload: (payload) => {
    const validationResult = RegisterPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateVerifyEmailPayload: (payload) => {
    const validationResult = VerifyEmailPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateChangePasswordPayload: (payload) => {
    const validationResult = ChangePasswordPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = UserValidator;