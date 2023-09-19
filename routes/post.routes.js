const router = require('express').Router();
const { validateRequest, checkAuth } = require('../middlewares');
const { postBodySchema, paginationSchema, idSchema } = require('../validation');
const { REQUEST_VALIDATION_TARGETS } = require('../constants');
const {
    addPost,
    getAllPosts,
    getPostById,
    deletePost,
    updatePost,
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
    validateRequest(idSchema, REQUEST_VALIDATION_TARGETS.ID),
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
    checkAuth,
    validateRequest(idSchema, REQUEST_VALIDATION_TARGETS.ID),
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
router.put(
    '/:id',
    checkAuth,
    validateRequest(idSchema, REQUEST_VALIDATION_TARGETS.ID),
    validateRequest(postBodySchema, REQUEST_VALIDATION_TARGETS.BODY),
    async (req, res, next) => {
        try {
            const post = await updatePost(req.params.id, req.body, req.user);

            res.json(post);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
