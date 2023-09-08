const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likeSchema = new Schema(
    {
        postId: {
            type: String,
            required: true,
        },
        commentId: {
            type: String,
        },
        userId: {
            type: String,
            required: true,
        },
        // TODO: remove this field
        userName: {
            type: String,
            required: true,
        },
        likeType: {
            type: String,
            // TODO: move to constants
            enum: ['post', 'comment'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
