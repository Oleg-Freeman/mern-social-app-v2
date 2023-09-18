const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        postId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        // TODO: remove this field
        userName: {
            type: String,
            required: false,
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
            required: true,
            default:
                'https://res.cloudinary.com/freeman999/image/upload/v1589014461/noAvatar2_skj96w.png',
        },
        // TODO: Reply to comment
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

commentSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'commentId',
    justOne: false,
});
commentSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
