const router = require('express').Router();
const Post = require('../models/post.model');
const Like = require('../models/like.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const { validateRequest, checkAuth } = require('../middlewares');
const { postBodySchema, paginationSchema } = require('../validation');
const { REQUEST_VALIDATION_TARGETS } = require('../constants');
const { addPost, getAllPosts } = require('../services/post.service');

// Get all posts
router.get(
    '/',
    validateRequest(paginationSchema, REQUEST_VALIDATION_TARGETS.QUERY),
    async (req, res, next) => {
        try {
            const posts = await getAllPosts(req.query);

            res.json(posts);
        } catch (error) {
            next(error);
        }
    }
);

// Add new post
router.post(
    '/',
    checkAuth,
    validateRequest(postBodySchema, REQUEST_VALIDATION_TARGETS.BODY),
    async (req, res, next) => {
        try {
            const post = await addPost(req.body, req.user);

            res.status(201).json(post);
        } catch (error) {
            next(error);
        }
    }
);

// Get one post by ID
router.get('/:id', async (req, res) => {
    try {
        await Post.findById(req.params.id)
            .populate({
                path: 'comments likes',
                populate: {
                    path: 'likes',
                },
            })
            .exec((err, post) => {
                if (err) return res.status(400).json('Error: ' + err);
                else if (post === null)
                    return res.status(400).json('No any posts found');
                else return res.json(post);
            });
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Delete one post
router.delete('/:id', checkAuth, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id).exec(async (err, post) => {
            if (err) return res.status(400).json('Error: ' + err);
            else if (post === null)
                return res.status(400).json('Post not found');
            else {
                await Like.deleteMany({ postId: post._id });
                // .exec((err, likes) => {
                //   if (err) return res.status(400).json('Error: ' + err);
                //   if (likes.nModified === 0) return res.status(400).json('Likes Not found');
                // });
                await Comment.deleteMany({ postId: post._id });
                // .exec((err, comments) => {
                //   if (err) return res.status(400).json('Error: ' + err);
                //   if (comments.nModified === 0) return res.status(400).json('Comments Not found');
                // });
                await User.findById(post.userId).exec(async (err, user) => {
                    if (err) return res.status(400).json('Error: ' + err);
                    else if (user === null)
                        return res.status(400).json('Internal error');
                    else {
                        const toDelete = user.posts.findIndex((deleteMe) => {
                            return deleteMe.toString() === req.params.id;
                        });
                        if (toDelete === -1)
                            return res.status(400).json('Post not found');
                        else {
                            user.postCount = --user.postCount;
                            user.posts.splice(toDelete, 1);
                            await user.save(() => {
                                res.json('Post deleted');
                            });
                        }
                    }
                });
            }
        });
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Update Post
router.put('/:id', checkAuth, async (req, res) => {
    try {
        await Post.findById(req.params.id).exec(async (err, post) => {
            if (err) return res.status(400).json('Error: ' + err);
            else if (post === null)
                return res.status(400).json('Post not found');
            else {
                // const { error } = bodyValidation(req.body);
                // if (error)
                //     return res.status(400).json(error.details[0].message);

                post.body = req.body.body;

                await post.save(() => {
                    res.json('Post updated!');
                });
            }
        });
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

module.exports = router;
