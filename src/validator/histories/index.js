const InvariantError = require('../../exceptions/invariant-error');
const { 
  HistoryListQuerySchema,
} = require('./schema');

const HistoryValidator = {
  validateHistoryListQuery: (queries) => {
    const validationResult = HistoryListQuerySchema.validate(queries);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = HistoryValidator;