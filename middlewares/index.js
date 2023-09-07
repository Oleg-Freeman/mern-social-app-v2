const checkAuth = require('./auth.middleware');
const validateRequest = require('./validation.middleware');

module.exports = {
    checkAuth,
    validateRequest,
};
