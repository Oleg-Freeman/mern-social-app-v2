const Joi = require('@hapi/joi');

module.exports = Joi.object({
    skip: Joi.number().min(0).optional(),
    limit: Joi.number().min(1).max(100).optional(),
});
