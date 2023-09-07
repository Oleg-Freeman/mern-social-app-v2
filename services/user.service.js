const User = require('../models/user.model');
const findAllUsers = async () => {
    return User.find()
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .populate({
            path: 'posts',
            populate: {
                path: 'comments likes',
                populate: {
                    path: 'likes',
                },
            },
        });
};

// const register = async ({ email, password, userName }) => {};

module.exports = {
    findAllUsers,
    // register,
};
