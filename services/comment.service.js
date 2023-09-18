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

module.exports = {
    addComment,
};
