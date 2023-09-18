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
commentSchema.virtual('post', {
    ref: 'Post',
    localField: 'postId',
    foreignField: '_id',
    justOne: true,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
