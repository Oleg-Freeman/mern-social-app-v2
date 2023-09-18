const mongoose = require('mongoose');
const DB_MODELS = require('../constants/db-models');

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
    ref: DB_MODELS.LIKE,
    localField: '_id',
    foreignField: 'commentId',
    justOne: false,
});
commentSchema.virtual('user', {
    ref: DB_MODELS.USER,
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});
commentSchema.virtual('post', {
    ref: DB_MODELS.POST,
    localField: 'postId',
    foreignField: '_id',
    justOne: true,
});

const Comment = mongoose.model(DB_MODELS.COMMENT, commentSchema);

module.exports = Comment;
