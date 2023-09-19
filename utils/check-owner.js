const CustomError = require('./custom-error');
const checkOwner = (resource, user) => {
    if (resource.userId.toString() !== user._id.toString()) {
        throw new CustomError(403, 'Forbidden');
    }
};

module.exports = checkOwner;
