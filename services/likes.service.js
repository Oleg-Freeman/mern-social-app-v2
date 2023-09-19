const Like = require('../models/like.model');
const { getPostById } = require('./post.service');
const { LIKE_TYPES } = require('../constants');
const { findCommentById } = require('./comment.service');
const { CustomError } = require('../utils');
const likePost = async ({ postId, user }) => {
    const post = await getPostById(postId);
    let like = await Like.findOne({
        userId: user._id,
        postId: post._id,
        likeType: LIKE_TYPES.POST,
    });

    if (like) {
        await Like.findByIdAndDelete(like._id);

        return;
    }

    like = await Like.create({
        userId: user._id,
        postId: post._id,
        likeType: LIKE_TYPES.POST,
    });

    return Like.findById(like._id).populate({
        path: 'user post',
    });
};

const likeComment = async ({ commentId, user }) => {
    const comment = await findCommentById(commentId);
    let like = await Like.findOne({
        userId: user._id,
        commentId: comment._id,
        likeType: LIKE_TYPES.COMMENT,
    });

    if (like) {
        await Like.findByIdAndDelete(like._id);

        return;
    }

    like = await Like.create({
        userId: user._id,
        commentId: comment._id,
        likeType: LIKE_TYPES.COMMENT,
    });

    return Like.findById(like._id).populate({
        path: 'user comment',
    });
};

const likeResource = async ({ likeType, resourceId, user }) => {
    let like;

    switch (likeType) {
        case LIKE_TYPES.POST: {
            like = await likePost({ postId: resourceId, user });

            break;
        }
        case LIKE_TYPES.COMMENT: {
            like = await likeComment({ commentId: resourceId, user });

            break;
        }
        default: {
            throw new CustomError(400, 'Invalid like type');
        }
    }

    return like;
};

module.exports = {
    likeResource,
};
