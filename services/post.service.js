const User = require('../models/user.model');
const Post = require('../models/post.model');
const { CustomError } = require('../utils');
const Like = require('../models/like.model');
const Comment = require('../models/comment.model');
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
            path: 'user comments likes',
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

const checkPostOwner = (post, user) => {
    return post.userId.toString() === user._id.toString();
};

const deletePost = async (id, user) => {
    const post = await getPostById(id);

    if (!checkPostOwner(post, user)) {
        throw new CustomError(403, 'Forbidden');
    }

    await Post.findByIdAndDelete(id);
    await User.findByIdAndUpdate(user._id, {
        $pullAll: {
            posts: [id],
        },
    });

    // TODO: test this
    if (post.likes && post.likes.length > 0) {
        await Like.deleteMany({ _id: { $in: post.likes } });
    }
    if (post.comments && post.comments.length > 0) {
        await Comment.deleteMany({ _id: { $in: post.comments } });
    }
};

const updatePost = async (id, data, user) => {
    const post = await getPostById(id);

    if (!checkPostOwner(post, user)) {
        throw new CustomError(403, 'Forbidden');
    }

    return Post.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
    addPost,
    getAllPosts,
    getPostById,
    deletePost,
    updatePost,
};
