const mongoose = require('mongoose');

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
            // TODO: move to environment variables
            default:
                'https://res.cloudinary.com/freeman999/image/upload/v1589014461/noAvatar2_skj96w.png',
        },
        bio: { type: String },
        website: { type: String },
        location: { type: String },
        // TODO: remove this field
        postCount: {
            type: Number,
            required: true,
            default: 0,
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        // TODO: remove this field
        isAuthenticated: {
            type: Boolean,
            required: true,
            default: false,
        },
        token: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
