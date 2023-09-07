const router = require('express').Router();
const {
    findAllUsers,
    registerUser,
    loginUser,
    logoutUser,
    findUserById,
    deleteUser,
    updateUser,
    uploadUserAvatar,
} = require('../services/user.service');
const { validateRequest, checkAuth } = require('../middlewares');
const {
    registerUserSchema,
    loginUserSchema,
    idSchema,
    updateUserSchema,
} = require('../validation');
const { REQUEST_VALIDATION_TARGETS } = require('../constants');
const { imageUpload } = require('../utils');

// Get all users from DB
router.route('/').get(async (req, res, next) => {
    try {
        const users = await findAllUsers();

        res.json(users);
    } catch (error) {
        next(error);
    }
});

// Register new user
router
    .route('/register')
    .post(
        validateRequest(registerUserSchema, REQUEST_VALIDATION_TARGETS.BODY),
        async (req, res, next) => {
            const { email, password, userName } = req.body;

            try {
                const user = await registerUser({ email, password, userName });

                res.status(201).json(user);
            } catch (error) {
                next(error);
            }
        }
    );

// Login
router
    .route('/login')
    .post(
        validateRequest(loginUserSchema, REQUEST_VALIDATION_TARGETS.BODY),
        async (req, res, next) => {
            try {
                const result = await loginUser(req.body);

                res.json(result);
            } catch (error) {
                next(error);
            }
        }
    );

// Logout
router.route('/logout').get(checkAuth, async (req, res, next) => {
    try {
        await logoutUser(req.user);

        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

// Get one user by ID
router
    .route('/:id')
    .get(
        validateRequest(idSchema, REQUEST_VALIDATION_TARGETS.PATH),
        async (req, res, next) => {
            try {
                const user = await findUserById(req.params.id);

                res.json(user);
            } catch (error) {
                next(error);
            }
        }
    );

// Delete user
router.route('/').delete(checkAuth, async (req, res, next) => {
    try {
        await deleteUser(req.user._id);

        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

// upload user profile image avatar
router
    .route('/image')
    .post(checkAuth, imageUpload.single('image'), async (req, res, next) => {
        try {
            await uploadUserAvatar(req.user, req.file);

            res.status(204).end();
        } catch (error) {
            next(error);
        }
    });

// Add user details
router
    .route('/')
    .patch(
        checkAuth,
        validateRequest(updateUserSchema, REQUEST_VALIDATION_TARGETS.BODY),
        async (req, res, next) => {
            try {
                const updatedUser = await updateUser(req.user, req.body);

                res.json(updatedUser);
            } catch (error) {
                next(error);
            }
        }
    );

module.exports = router;
