const router = require('express').Router();
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const { validateRequest, checkAuth } = require('../middlewares');
const { postBodySchema, idSchema } = require('../validation');
const { REQUEST_VALIDATION_TARGETS } = require('../constants');
const {
    addComment,
    getAllCommentsByPostId,
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
            const comment = await addComment(
                req.params.postId,
                req.body,
                req.user
            );

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
            await Comment.findByIdAndDelete(req.params.commentId).exec(
                async (err, comment) => {
                    if (err) return res.status(400).json('Error: ' + err);
                    else if (comment === null)
                        return res.status(400).json('Comments not found');
                    else {
                        await Post.findById(comment.postId).exec(
                            async (err, post) => {
                                if (err)
                                    return res
                                        .status(400)
                                        .json('Error: ' + err);
                                else if (post === null)
                                    return res
                                        .status(400)
                                        .json('Internal error');
                                else {
                                    const toDelete = post.comments.findIndex(
                                        (deleteMe) => {
                                            return (
                                                deleteMe.toString() ===
                                                req.params.commentId
                                            );
                                        }
                                    );
                                    if (toDelete === -1)
                                        throw new Error('Comment not found');
                                    else {
                                        post.commentCount = --post.commentCount;
                                        post.comments.splice(toDelete, 1);
                                        await post.save(() => {
                                            res.json('Comment deleted');
                                        });
                                    }
                                }
                            }
                        );
                    }
                }
            );
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
            await Comment.findOneAndUpdate(
                { _id: req.params.commentId },
                { body: req.body.body }
            ).exec((err, comment) => {
                if (err) return res.status(400).json('Error: ' + err);
                else if (comment === null)
                    return res.status(400).json('Comment not found');
                else return res.json('Comment updated!');
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
