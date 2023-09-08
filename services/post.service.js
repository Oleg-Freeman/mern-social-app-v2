const User = require('../models/user.model');
const Post = require('../models/post.model');
const { CustomError } = require('../utils');
const addPost = async (data, user) => {
    const post = await Post.create({ ...data, userId: user._id });

    await User.findByIdAndUpdate(user._id, {
        $push: {
            posts: post._id,
        },
    });

    return post;
};

const getAllPosts = async ({ skip = 0, limit = 100 }) => {
    return Post.find()
        .sort({ createdAt: -1 })
        .limit(+limit)
        .skip(+skip)
        .populate({
            // TODO: nested pagination
            path: 'comments likes',
            populate: {
                path: 'likes',
            },
        });
};

const getPostById = async (id) => {
    const post = await Post.findById(id).populate({
        path: 'comments likes',
        populate: {
            path: 'likes',
        },
    });

    if (!post) {
        throw new CustomError(404, 'Post not found');
    }

    return post;
};

module.exports = {
    addPost,
    getAllPosts,
    getPostById,
};
