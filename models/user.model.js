const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        // TODO: add email verification
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
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
});
userSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
});
userSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
