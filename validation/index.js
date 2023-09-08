const registerUserSchema = require('./register-user.schema');
const loginUserSchema = require('./login-user.schema');
const updateUserSchema = require('./update-user.schema');
const idSchema = require('./id.schema');
const postBodySchema = require('./post-body.schema');

module.exports = {
    registerUserSchema,
    loginUserSchema,
    updateUserSchema,
    idSchema,
    postBodySchema,
};