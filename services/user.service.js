const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { CustomError } = require('../utils');

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

const registerUser = async ({ email, password, userName }) => {
    // Check if User Exists in DB
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        throw new CustomError(400, 'Email already exists');
    }

    const newUserData = { email, password, userName };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUserData.password = await bcrypt.hash(password, salt);

    return User.create(newUserData);
};

module.exports = {
    findAllUsers,
    registerUser,
};
