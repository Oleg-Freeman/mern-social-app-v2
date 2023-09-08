const router = require('express').Router();
const Post = require('../models/post.model');
const { validateRequest, checkAuth } = require('../middlewares');
const { postBodySchema, paginationSchema, idSchema } = require('../validation');
const { REQUEST_VALIDATION_TARGETS } = require('../constants');
const {
    addPost,
    getAllPosts,
    getPostById,
    deletePost,
} = require('../services/post.service');

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
router.get(
    '/:id',
    validateRequest(idSchema, REQUEST_VALIDATION_TARGETS.PATH),
    async (req, res, next) => {
        try {
            const post = await getPostById(req.params.id);

            res.json(post);
        } catch (error) {
            next(error);
        }
    }
);

// Delete one post
router.delete(
    '/:id',
    validateRequest(idSchema, REQUEST_VALIDATION_TARGETS.PATH),
    checkAuth,
    async (req, res, next) => {
        try {
            await deletePost(req.params.id, req.user);

            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
);

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
