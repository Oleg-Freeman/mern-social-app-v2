const { getPostById } = require('./post.service');
const Comment = require('../models/comment.model');

const addComment = async (postId, data, user) => {
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

module.exports = {
    addComment,
    getAllCommentsByPostId,
};
