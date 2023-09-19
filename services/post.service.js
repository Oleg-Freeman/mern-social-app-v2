const Post = require('../models/post.model');
const { CustomError, checkOwner } = require('../utils');

const addPost = async (data, user) => {
    const post = await Post.create({ ...data, userId: user._id });

    return Post.findById(post._id).populate({
        path: 'user',
        select: '-password -__v',
    });
};

const getAllPosts = async ({ skip = 0, limit = 100 }) => {
    return Post.find()
        .sort({ createdAt: -1 })
        .limit(+limit)
        .skip(+skip)
        .populate({
            // TODO: nested pagination
            path: 'user comments likes',
        });
};

const getPostById = async (id) => {
    const post = await Post.findById(id).populate({
        path: 'comments likes user',
    });

    if (!post) {
        throw new CustomError(404, 'Post not found');
    }

    return post;
};

// TODO: delete likes and comments
const deletePost = async (id, user) => {
    const post = await getPostById(id);

    checkOwner(post, user);

    await Post.findByIdAndDelete(id);
};

const updatePost = async (id, data, user) => {
    const post = await getPostById(id);

    checkOwner(post, user);

    return Post.findByIdAndUpdate(id, data, {
        new: true,
        populate: 'user comments likes',
    });
};

module.exports = {
    addPost,
    getAllPosts,
    getPostById,
    deletePost,
    updatePost,
};
