const Joi = require('@hapi/joi');

module.exports = Joi.string().hex().length(24);
