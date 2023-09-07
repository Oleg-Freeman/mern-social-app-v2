const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { CustomError } = require('../utils');
const jwt = require('jsonwebtoken');

const findAllUsers = async () => {
    return User.find()
        .select('-password -__v -token')
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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        email,
        password: hashedPassword,
        userName,
    });

    return User.findById(newUser._id, '-password -__v');
};

const loginUser = async ({ email, password }) => {
    let user = await User.findOne({ email });

    if (!user) {
        throw new CustomError(400, 'Wrong credentials, try again');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new CustomError(400, 'Wrong credentials, try again');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    await User.updateOne({ _id: user._id }, { $set: { token } });

    user = await User.findById(user._id, '-password -__v');

    return { user, token };
};

const logoutUser = async (user) => {
    await User.updateOne({ _id: user._id }, { $unset: { token: 1 } });
};

const findUserById = async (id) => {
    const user = await User.findById(id)
        .select('-password -__v -token')
        .populate({
            path: 'posts',
            populate: {
                path: 'comments likes',
                populate: {
                    path: 'likes',
                },
            },
        });

    if (!user) {
        throw new CustomError(404, 'User not found');
    }

    return user;
};

// TODO: delete all user related data
const deleteUser = async (id) => {
    await User.findByIdAndDelete(id);
};

const updateUser = async (user, data) => {
    return User.findByIdAndUpdate(user._id, data, { new: true }).select(
        '-password -__v -token'
    );
};

module.exports = {
    findAllUsers,
    registerUser,
    loginUser,
    logoutUser,
    findUserById,
    deleteUser,
    updateUser,
};
