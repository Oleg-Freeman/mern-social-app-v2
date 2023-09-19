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
const { validateRequest, checkAuth, imageUpload } = require('../middlewares');
const {
    registerUserSchema,
    loginUserSchema,
    idSchema,
    updateUserSchema,
} = require('../validation');
const { REQUEST_VALIDATION_TARGETS } = require('../constants');

// TODO: add pagination
// Get all users from DB
router.get('/', async (req, res, next) => {
    try {
        const users = await findAllUsers({});

        res.json(users);
    } catch (error) {
        next(error);
    }
});

// Register new user
router.post(
    '/register',
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
router.post(
    '/login',
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
router.get('/logout', checkAuth, async (req, res, next) => {
    try {
        await logoutUser(req.user);

        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

// Get one user by ID
router.get(
    '/:id',
    validateRequest(idSchema, REQUEST_VALIDATION_TARGETS.ID),
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
router.delete('/', checkAuth, async (req, res, next) => {
    try {
        await deleteUser(req.user._id);

        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

// upload user profile image avatar
router.post(
    '/image',
    checkAuth,
    imageUpload.single('image'),
    async (req, res, next) => {
        try {
            await uploadUserAvatar(req.user, req.file);

            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
);

// Add user details
router.patch(
    '/',
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
