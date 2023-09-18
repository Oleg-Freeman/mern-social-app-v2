const mongoose = require('mongoose');
const DB_MODELS = require('../constants/db-models');

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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

postSchema.virtual('user', {
    ref: DB_MODELS.USER,
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});
postSchema.virtual('likes', {
    ref: DB_MODELS.LIKE,
    localField: '_id',
    foreignField: 'postId',
    justOne: false,
});
postSchema.virtual('comments', {
    ref: DB_MODELS.COMMENT,
    localField: '_id',
    foreignField: 'postId',
    justOne: false,
});

const Post = mongoose.model(DB_MODELS.POST, postSchema);

module.exports = Post;
