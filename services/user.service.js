const User = require('../models/user.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const bcrypt = require('bcryptjs');
const { CustomError } = require('../utils');
const jwt = require('jsonwebtoken');
const { imageUploader } = require('../utils');
const crypto = require('crypto');
const dayjs = require('dayjs');

const findAllUsers = async ({ skip = 0, limit = 100 }) => {
    return (
        User.find()
            .select('-password -__v -token')
            .sort({ createdAt: -1 })
            .limit(+limit)
            .skip(+skip)
            // TODO: test deep populate
            .populate({
                path: 'posts comments likes',
            })
    );
};

const registerUser = async ({ email, password, userName, hostName }) => {
    // Check if User Exists in DB
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        throw new CustomError(400, 'Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const emailVerificationToken = crypto.randomBytes(64).toString('base64url');

    const newUser = await User.create({
        email,
        password: hashedPassword,
        userName,
        emailVerificationToken,
        emailVerificationTokenIssuedAt: new Date(),
    });

    // console.log(
    //     `http://${hostName}/users/confirm-email/${emailVerificationToken}`
    // );

    // TODO: email are not delivered
    // await mailer.sendEmail({
    //     to: email,
    //     subject: 'Verify your email address',
    //     html: `
    //         <h1>Verify your email address</h1>
    //         <p>Hi ${userName},</p>
    //         <p>Thanks for creating an account at Social App. Please verify your email address by clicking the link below.</p>
    //         <a href="http://${hostName}/confirm-email/${emailVerificationToken}">Verify Email</a>
    //         <p>If you did not create an account, no further action is required.</p>
    //         <p>Regards,</p>
    //         <p>Social App Team</p>
    //     `,
    // });

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

    user = await User.findById(user._id, '-password -__v -token');

    return { user, token };
};

const logoutUser = async (user) => {
    await User.updateOne({ _id: user._id }, { $unset: { token: 1 } });
};

const findUserById = async (id) => {
    const user = await User.findById(id)
        .select('-password -__v -token')
        .populate({
            path: 'posts comments likes',
            // TODO: replace with aggregation. Virtuals cannot be populated
            // populate: {
            //     path: 'comments likes',
            //     populate: {
            //         path: 'likes',
            //     },
            // },
        });

    if (!user) {
        throw new CustomError(404, 'User not found');
    }

    return user;
};

const deleteUser = async (id) => {
    const posts = await Post.find({ userId: id });
    const postIds = posts.map((p) => p._id);
    const comments = await Comment.find({
        $or: [{ userId: id }, { postId: { $in: postIds } }],
    });
    const commentIds = comments.map((c) => c._id);

    await User.findByIdAndDelete(id);
    await Post.deleteMany({ _id: { $in: postIds } });
    await Comment.deleteMany({ _id: { $in: commentIds } });
    await Like.deleteMany({
        $or: [
            { userId: id },
            { postId: { $in: postIds } },
            { commentId: { $in: commentIds } },
        ],
    });
};

const updateUser = async (user, data) => {
    return User.findByIdAndUpdate(user._id, data, { new: true }).select(
        '-password -__v -token'
    );
};

// TODO: delete old avatar
const uploadUserAvatar = async (user, file) => {
    const imageURL = await imageUploader.upload(file.path);

    await User.findOneAndUpdate({ _id: user._id }, { imageURL });
};

const confirmUserEmail = async (emailVerificationToken) => {
    const user = await User.findOne({ emailVerificationToken });

    if (!user) {
        throw new CustomError(404, 'User not found');
    }
    if (dayjs().diff(user.emailVerificationTokenIssuedAt, 'hour') > 1) {
        throw new CustomError(400, 'Token expired');
    }
    if (user.isVerified) {
        throw new CustomError(400, 'Email already verified');
    }

    await User.findByIdAndUpdate(user._id, {
        $set: { isVerified: true },
        $unset: {
            emailVerificationToken: 1,
            emailVerificationTokenIssuedAt: 1,
        },
    });
};

module.exports = {
    findAllUsers,
    registerUser,
    loginUser,
    logoutUser,
    findUserById,
    deleteUser,
    updateUser,
    uploadUserAvatar,
    confirmUserEmail,
};
