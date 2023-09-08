const User = require('../models/user.model');
const Post = require('../models/post.model');
const addPost = async (data, user) => {
    const post = await Post.create({ ...data, userId: user._id });

    await User.findByIdAndUpdate(user._id, {
        $push: {
            posts: post._id,
        },
    });

    return post;
};

module.exports = {
    addPost,
};
