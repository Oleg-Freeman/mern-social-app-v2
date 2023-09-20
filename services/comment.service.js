const { getPostById } = require('./post.service');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const { CustomError, checkOwner } = require('../utils');
const { LIKE_TYPES } = require('../constants');

const addComment = async ({ postId, data, user }) => {
    const post = await getPostById(postId);
    const comment = await Comment.create({
        ...data,
        userId: user._id,
        postId: post._id,
    });

    return Comment.findById(comment._id).populate({
        path: 'user post',
        select: '-password -__v',
    });
};

const getAllCommentsByPostId = async ({ postId, skip = 0, limit = 100 }) => {
    const post = await getPostById(postId);

    return Comment.find({ postId: post._id })
        .sort({ createdAt: -1 })
        .limit(+limit)
        .skip(+skip)
        .populate('likes user post');
};

const getCommentById = async (id) => {
    const comment = await Comment.findById(id);

    if (!comment) {
        throw new CustomError(404, 'Comment not found');
    }

    return comment;
};

const updateComment = async ({ id, data, user }) => {
    const comment = await getCommentById(id);

    checkOwner(comment, user);

    return Comment.findByIdAndUpdate(comment._id, data, {
        new: true,
        populate: 'user post likes',
    });
};

const deleteComment = async ({ id, user }) => {
    const comment = await getCommentById(id);

    checkOwner(comment, user);

    await Comment.findByIdAndDelete(id);
    await Like.deleteMany({
        commentId: comment._id,
        likeType: LIKE_TYPES.COMMENT,
    });
};

module.exports = {
    addComment,
    getAllCommentsByPostId,
    updateComment,
    deleteComment,
    getCommentById,
};
