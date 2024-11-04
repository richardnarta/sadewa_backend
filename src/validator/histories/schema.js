const Joi = require('joi');

const HistoryListQuerySchema = Joi.object({
  page: Joi.number()
})

module.exports = { 
  HistoryListQuerySchema,
};