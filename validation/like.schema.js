const Joi = require('@hapi/joi');
const IdSchema = require('./id.schema');
const { LIKE_TYPES } = require('../constants');

module.exports = Joi.object({
    resourceId: IdSchema,
    likeType: Joi.string()
        .valid(...Object.values(LIKE_TYPES))
        .required(),
});
