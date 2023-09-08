const router = require('express').Router();
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const { validateRequest, checkAuth } = require('../middlewares');
const { postBodySchema, idSchema } = require('../validation');
const { REQUEST_VALIDATION_TARGETS } = require('../constants');
const { addComment } = require('../services/comment.service');

// Get all comments from DB
router.get('/', async (req, res) => {
    try {
        await Comment.find()
            .sort({ createdAt: -1 })
            .populate('likes')
            .exec((err, comments) => {
                if (err) return res.status(400).json('Error: ' + err);
                else if (comments === null || comments.length === 0)
                    return res.status(400).json('No any comments found');
                else return res.json(comments);
            });
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Get all comments on post
router.get('/:postId', async (req, res) => {
    try {
        await Comment.find({ postId: req.param.postId })
            .sort({ createdAt: -1 })
            .populate('likes')
            .exec((err, comments) => {
                if (err) return res.status(400).json('Error: ' + err);
                else if (comments === null || comments.length === 0)
                    return res
                        .status(400)
                        .json('No any comments on this post found');
                else return res.json(comments);
            });
    } catch (err) {
        res.status(400).json('Error: ' + err);
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
    '/:commentId',
    /* ensureAuthenticated, */ async (req, res) => {
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
        } catch (err) {
            res.status(400).json('Error: ' + err);
        }
    }
);

// Update comment
router.post(
    '/update/:commentId',
    /* ensureAuthenticated, */ async (req, res) => {
        // const { error } = bodyValidation(req.body);
        // if (error) return res.status(400).json(error.details[0].message);
        // else {
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
        } catch (err) {
            res.status(400).json('Error: ' + err);
        }
        // }
    }
);

module.exports = router;
