const { getPostById } = require('./post.service');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const addComment = async (postId, data, user) => {
    const post = await getPostById(postId);
    const comment = await Comment.create({
        ...data,
        userId: user._id,
        postId: post._id,
    });

    await User.findByIdAndUpdate(user._id, {
        $push: {
            comments: comment._id,
        },
    });
    await Post.findByIdAndUpdate(post._id, {
        $push: {
            comments: comment._id,
        },
    });

    return comment;
};

module.exports = {
    addComment,
};
