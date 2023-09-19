const router = require('express').Router();
const { validateRequest, checkAuth } = require('../middlewares');
const { likeSchema } = require('../validation');
const { REQUEST_VALIDATION_TARGETS } = require('../constants');
const { likeResource } = require('../services/likes.service');

// TODO: get all user likes

// Like Post or Comment. If the user has already liked the resource, the like will be removed.
router.post(
    '/:likeType/:resourceId',
    checkAuth,
    validateRequest(likeSchema, REQUEST_VALIDATION_TARGETS.PATH),
    async (req, res, next) => {
        try {
            const like = await likeResource({
                resourceId: req.params.resourceId,
                likeType: req.params.likeType,
                user: req.user,
            });

            if (like) {
                return res.status(201).json(like);
            }

            return res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
