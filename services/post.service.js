const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const { CustomError, checkOwner } = require('../utils');
const { LIKE_TYPES } = require('../constants');

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
            select: '-password -__v -token',
        });
};

const getPostById = async (id) => {
    const post = await Post.findById(id).populate({
        path: 'comments likes user',
        select: '-password -__v -token',
    });

    if (!post) {
        throw new CustomError(404, 'Post not found');
    }

    return post;
};

const deletePost = async (id, user) => {
    const post = await getPostById(id);

    checkOwner(post, user);

    await Post.findByIdAndDelete(id);

    const comments = await Comment.find({ postId: post._id });
    const commentIds = comments.map((c) => c._id);

    await Comment.deleteMany({ _id: { $in: commentIds } });
    await Like.deleteMany({ postId: post._id, likeType: LIKE_TYPES.POST });
    await Like.deleteMany({
        commentId: { $in: commentIds },
        likeType: LIKE_TYPES.COMMENT,
    });
};

const updatePost = async (id, data, user) => {
    const post = await getPostById(id);

    checkOwner(post, user);

    await Post.findByIdAndUpdate(id, data);

    return Post.findById(id).populate({
        path: 'comments likes user',
        select: '-password -__v -token',
    });
};

module.exports = {
    addPost,
    getAllPosts,
    getPostById,
    deletePost,
    updatePost,
};
