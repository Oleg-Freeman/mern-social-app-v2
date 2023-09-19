const registerUserSchema = require('./register-user.schema');
const loginUserSchema = require('./login-user.schema');
const updateUserSchema = require('./update-user.schema');
const idSchema = require('./id.schema');
const postBodySchema = require('./post-body.schema');
const paginationSchema = require('./pagination.schema');
const likeSchema = require('./like.schema');

module.exports = {
    registerUserSchema,
    loginUserSchema,
    updateUserSchema,
    idSchema,
    postBodySchema,
    paginationSchema,
    likeSchema,
};
