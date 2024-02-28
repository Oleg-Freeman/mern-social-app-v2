const mongoose = require('mongoose');
const DB_MODELS = require('../constants/db-models');
const config = require('../config');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            minlength: 6,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        userName: {
            type: String,
            required: true,
        },
        birthDay: { type: Date },
        imageURL: {
            type: String,
            required: true,
            default: config.getDefaultUserAvatar(),
        },
        bio: { type: String },
        website: { type: String },
        location: { type: String },
        token: { type: String },
        isVerified: { type: Boolean, default: false },
        emailVerificationToken: { type: String },
        emailVerificationTokenIssuedAt: { type: Date },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual('posts', {
    ref: DB_MODELS.POST,
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
});
userSchema.virtual('comments', {
    ref: DB_MODELS.COMMENT,
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
});
userSchema.virtual('likes', {
    ref: DB_MODELS.LIKE,
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
});

const User = mongoose.model(DB_MODELS.USER, userSchema);

module.exports = User;
