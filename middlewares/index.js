const checkAuth = require('./auth.middleware');
const validateRequest = require('./validation.middleware');
const imageUpload = require('./image-upload.middleware');

module.exports = {
    checkAuth,
    validateRequest,
    imageUpload,
};
