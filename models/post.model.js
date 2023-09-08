const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        // TODO: remove this field
        userName: {
            type: String,
            required: false,
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
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Like',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
