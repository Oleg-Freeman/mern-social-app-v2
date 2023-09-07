const Joi = require('@hapi/joi');

const updateUserSchema = Joi.object({
    bio: Joi.string().empty().not(' '),
    website: Joi.string().empty().not(' '),
    location: Joi.string().empty().not(' '),
    birthDay: Joi.date().empty().less('now').iso().not(' '),
});

module.exports = updateUserSchema;
