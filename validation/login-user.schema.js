const Joi = require('@hapi/joi');

const loginUserSchema = Joi.object({
    email: Joi.string().required().min(6).max(254).email().lowercase(),
    password: Joi.string().min(6).max(72, 'utf8').required(),
});

module.exports = loginUserSchema;
