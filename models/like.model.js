const mongoose = require('mongoose');
const DB_MODELS = require('../constants/db-models');
const { LIKE_TYPES } = require('../constants');

const Schema = mongoose.Schema;

const likeSchema = new Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        likeType: {
            type: String,
            enum: Object.values(LIKE_TYPES),
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
likeSchema.virtual('user', {
    ref: DB_MODELS.USER,
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});
likeSchema.virtual('post', {
    ref: DB_MODELS.POST,
    localField: 'postId',
    foreignField: '_id',
    justOne: true,
});
likeSchema.virtual('comment', {
    ref: DB_MODELS.COMMENT,
    localField: 'commentId',
    foreignField: '_id',
    justOne: true,
});
likeSchema.index({ postId: 1, commentId: 1, userId: 1 }, { unique: true });

const Like = mongoose.model(DB_MODELS.LIKE, likeSchema);

module.exports = Like;
