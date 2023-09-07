const Joi = require('@hapi/joi');

const registerUserSchema = Joi.object({
    email: Joi.string().required().min(6).max(254).email().lowercase(),
    password: Joi.string().min(6).max(72, 'utf8').required(),
    password2: Joi.any().valid(Joi.ref('password')).required(),
    userName: Joi.string().min(3).max(128).required(),
});

module.exports = registerUserSchema;
