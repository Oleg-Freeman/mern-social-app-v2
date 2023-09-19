const router = require('express').Router();
const { validateRequest, checkAuth } = require('../middlewares');
const { postBodySchema, idSchema } = require('../validation');
const { REQUEST_VALIDATION_TARGETS } = require('../constants');
const {
    addComment,
    getAllCommentsByPostId,
    updateComment,
    deleteComment,
} = require('../services/comment.service');

// Get all comments on post
router.get('/:postId', async (req, res, next) => {
    try {
        const comments = await getAllCommentsByPostId({
            postId: req.params.postId,
            skip: req.query.skip,
            limit: req.query.limit,
        });

        res.json(comments);
    } catch (error) {
        next(error);
    }
});

// Add new comment
router.post(
    '/:postId',
    checkAuth,
    validateRequest(idSchema, REQUEST_VALIDATION_TARGETS.PATH),
    validateRequest(postBodySchema, REQUEST_VALIDATION_TARGETS.BODY),
    async (req, res, next) => {
        try {
            const comment = await addComment({
                postId: req.params.postId,
                data: req.body,
                user: req.user,
            });

            res.status(201).json(comment);
        } catch (error) {
            next(error);
        }
    }
);

// Delete comment
router.delete(
    '/:id',
    checkAuth,
    validateRequest(idSchema, REQUEST_VALIDATION_TARGETS.PATH),
    async (req, res, next) => {
        try {
            await deleteComment({ id: req.params.id, user: req.user });

            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
);

// Update comment
router.put(
    '/:id',
    checkAuth,
    validateRequest(idSchema, REQUEST_VALIDATION_TARGETS.PATH),
    validateRequest(postBodySchema, REQUEST_VALIDATION_TARGETS.BODY),
    async (req, res, next) => {
        try {
            const comment = await updateComment({
                id: req.params.id,
                user: req.user,
                data: req.body,
            });

            res.json(comment);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
