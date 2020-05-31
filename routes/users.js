const router = require('express').Router();
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const bcrypt = require('bcrypt');
// Image upload
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
// Validations
const {
  registerValidation,
  ensureAuthenticated,
  loginValidation,
  userDetailsValidation,
  isloggedIn
} = require('../middlewares/validation');

require('dotenv').config({ path: './config/.env' });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + '_image');
  }
});

const imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

// Get all users from DB
router.route('/').get(async(req, res) => {
  try {
    await User.find()
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .populate({
        path: 'posts',
        populate: {
          path: 'comments likes',
          populate: {
            path: 'likes'
          }
        }
      })
      .exec((err, users) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (users === null || users.length === 0) return res.status(400).json('No any registered users found');
        else return res.json(users);
      });
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Register new user
router.route('/register').post(isloggedIn, async(req, res) => {
  const { email, password, userName } = req.body;

  // Validate data
  const { error } = registerValidation(req.body);

  if (error && error.details[0].path[0] === 'email') {
    return res.status(400).json({
      email: error.details[0].message,
      message: 'Wrong credentials, try again'
    });
  }
  if (error && error.details[0].path[0] === 'password') {
    return res.status(400).json({
      password: error.details[0].message,
      message: 'Wrong credentials, try again'
    });
  }
  if (error && error.details[0].path[0] === 'password2') {
    return res.status(400).json({
      password2: 'Confirm password do not match',
      message: 'Wrong credentials, try again'
    });
  }
  if (error && error.details[0].path[0] === 'userName') {
    return res.status(400).json({
      userName: error.details[0].message,
      message: 'Wrong credentials, try again'
    });
  }

  // Check if User Exists in DB
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).json({ message: 'Email is already exists' });

  const newUser = new User({ email, password, userName });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(req.body.password, salt);
  try {
    await newUser.save();
    res.json('User added!');
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Login
router.route('/login').post(isloggedIn, async(req, res) => {
  const { error } = loginValidation(req.body);
  if (error && error.details[0].path[0] === 'email') {
    return res.status(400).json({
      email: error.details[0].message,
      message: 'Wrong credentials, try again'
    });
  }
  if (error && error.details[0].path[0] === 'password') {
    return res.status(400).json({
      password: error.details[0].message,
      message: 'Wrong credentials, try again'
    });
  }
  try {
    await User.findOne({ email: req.body.email })
      .exec(async(err, user) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (user === null || user.length === 0) return res.status(400).json('Wrong credentials, try again');
        else if (user.isAuthenticated === true) return res.json(user._id);
        else {
        // Match password
          await bcrypt.compare(req.body.password, user.password, async(err, isMatch) => {
            if (err) {
              console.log(err);
              return res.status(400).json('Error: ' + err);
            }
            if (isMatch) {
              user.isAuthenticated = true;

              await user.save(() => {
                res.json(user._id);
              });
            }
            else {
              return res.status(400).json('Wrong credentials, try again');
            }
          });
        }
      });
  }
  catch (err) {
    console.log(err);
  }
});

// Logout
router.route('/logout/:id').get(async(req, res) => {
  try {
    await User.findById(req.params.id)
      .exec(async(err, user) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (user === null || user.length === 0) return res.status(400).json('User not found');
        else if (user.isAuthenticated === false) return res.json({ notAuthenticated: true });
        else {
          user.isAuthenticated = false;
          await user.save(() => {
            res.json({ loggedOut: true });
          });
        }
      });
  }
  catch (err) {
    console.log(err);
  }
});

// Get one user by ID
router.route('/:id').get(async(req, res) => {
  try {
    await User.findById(req.params.id)
      .select('-password -__v')
      .populate({
        path: 'posts',
        populate: {
          path: 'comments likes',
          populate: {
            path: 'likes'
          }
        }
      })
      .exec((err, user) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (user === null) return res.status(400).json('Error: user not found');
        else return res.json(user);
      });
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete user
router.route('/:id').delete(ensureAuthenticated, (req, res) => {
  try {
    User.findByIdAndDelete(req.params.id)
      .exec((err, user) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (user === null) return res.status(400).json('Error: user not found');
        else return res.json('User deleted');
      });
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// upload user profie image avatar
router.route('/image').post(ensureAuthenticated, upload.single('image'), async(req, res) => { // ensureAuthenticated,
  try {
    const token = req.headers.token;
    await cloudinary.uploader.upload(req.file.path, async(error, result) => {
      if (error) {
        return res.status(400).json('Error in image upload - ' + error);
      }
      else {
        await User.findOneAndUpdate({ _id: token }, { imageURL: result.secure_url });
        // .exec((err, user) => {
        //   if (err) return res.status(400).json('Error: ' + err);
        //   if (user === null) return res.status(400).json('User Not found');
        // });
        await Post.updateMany({ userId: token }, { imageURL: result.secure_url });
        // .exec((err, posts) => {
        //   if (err) return res.status(400).json('Error: ' + err);
        //   if (posts.nModified === 0) return res.status(400).json('Post Not found');
        // });
        await Comment.updateMany({ userId: token }, { imageURL: result.secure_url });
        // .exec((err, comments) => {
        //   if (err) return res.status(400).json('Error: ' + err);
        //   if (comments.nModified === 0) return res.status(400).json('Comments Not found');
        // });
        return res.json('Image uploaded');
      }
    });
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add user details
router.route('/update/:id').post(ensureAuthenticated, async(req, res) => {
  try {
    const { error } = userDetailsValidation(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    else {
      await User.findById(req.params.id)
        .exec(async(err, user) => {
          if (err) return res.status(400).json('Error: ' + err);
          else if (user === null) return res.status(400).json('User not found');
          else {
            if (('bio' in req.body) && (req.body.bio !== undefined)) {
              user.bio = req.body.bio;
            }
            if (('website' in req.body) && (req.body.website !== undefined)) {
              if (req.body.website.trim().substring(0, 4) !== 'http') {
                user.website = `http://${req.body.website.trim()}`;
              }
              else user.website = req.body.website;
            }
            if (('location' in req.body) && (req.body.location !== undefined)) {
              user.location = req.body.location;
            }
            if (('birthDay' in req.body) && (req.body.birthDay !== undefined)) {
              user.birthDay = req.body.birthDay;
            }

            await user.save(() => {
              res.json(user);
            });
          }
        });
    }
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
