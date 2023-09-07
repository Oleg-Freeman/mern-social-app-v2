const router = require('express').Router();
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
// Image upload
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {
    findAllUsers,
    registerUser,
    loginUser,
    logoutUser,
    findUserById,
    deleteUser,
    updateUser,
} = require('../services/user.service');
const { validateRequest, checkAuth } = require('../middlewares');
const {
    registerUserSchema,
    loginUserSchema,
    idSchema,
    updateUserSchema,
} = require('../validation');
const { REQUEST_VALIDATION_TARGETS } = require('../constants');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_image');
    },
});

const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage, fileFilter: imageFilter });

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

// upload user profie image avatar
router
    .route('/image')
    .post(checkAuth, upload.single('image'), async (req, res) => {
        try {
            const userId = req.user._id;
            await cloudinary.uploader.upload(
                req.file.path,
                async (error, result) => {
                    if (error) {
                        return res
                            .status(400)
                            .json('Error in image upload - ' + error);
                    } else {
                        await User.findOneAndUpdate(
                            { _id: userId },
                            { imageURL: result.secure_url }
                        );
                        // .exec((err, user) => {
                        //   if (err) return res.status(400).json('Error: ' + err);
                        //   if (user === null) return res.status(400).json('User Not found');
                        // });
                        await Post.updateMany(
                            { userId },
                            { imageURL: result.secure_url }
                        );
                        // .exec((err, posts) => {
                        //   if (err) return res.status(400).json('Error: ' + err);
                        //   if (posts.nModified === 0) return res.status(400).json('Post Not found');
                        // });
                        await Comment.updateMany(
                            { userId },
                            { imageURL: result.secure_url }
                        );
                        // .exec((err, comments) => {
                        //   if (err) return res.status(400).json('Error: ' + err);
                        //   if (comments.nModified === 0) return res.status(400).json('Comments Not found');
                        // });
                        return res.json('Image uploaded');
                    }
                }
            );
        } catch (err) {
            res.status(400).json('Error: ' + err);
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
