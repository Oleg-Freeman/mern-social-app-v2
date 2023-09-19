require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../db');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const users = require('./users.json');

// const testPassword = '12Aa*a11';
const testPost = 'Test Post';
const testComment = 'Test Comment';
const seed = async () => {
    try {
        connectDB();

        await User.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});
        await Like.deleteMany({});

        const newUsers = await User.insertMany(users);
        const posts = await Post.insertMany(
            [...newUsers, ...newUsers].map((user, index) => ({
                userId: user._id,
                body: `${testPost} ${index + 1}`,
            }))
        );
        const comments = await Comment.insertMany(
            posts.map((post, index) => ({
                postId: post._id,
                userId: post.userId,
                body: `${testComment} ${index + 1}`,
            }))
        );
        await Like.insertMany(
            posts.map((post) => ({
                postId: post._id,
                userId: post.userId,
                likeType: 'post',
            }))
        );
        await Like.insertMany(
            comments.map((comment) => ({
                commentId: comment._id,
                userId: comment.userId,
                likeType: 'comment',
            }))
        );

        console.log('Data import success');

        mongoose.connection.close();

        process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        process.exit(1);
    }
};

seed();
