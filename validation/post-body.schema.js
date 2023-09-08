const Joi = require('@hapi/joi');

module.exports = Joi.object({
    body: Joi.string().required().empty().not(' '),
});
