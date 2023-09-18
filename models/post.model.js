const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        // TODO: remove this field
        likeCount: {
            type: Number,
            required: true,
            default: 0,
        },
        // TODO: remove this field
        commentCount: {
            type: Number,
            required: true,
            default: 0,
        },
        // TODO: remove this field
        imageURL: {
            type: String,
            required: false,
            default:
                'https://res.cloudinary.com/freeman999/image/upload/v1589014461/noAvatar2_skj96w.png',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

postSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});
postSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'postId',
    justOne: false,
});
postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'postId',
    justOne: false,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
