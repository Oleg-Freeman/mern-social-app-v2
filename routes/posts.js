const router = require('express').Router();
const Post = require('../models/post.model');
const Like = require('../models/like.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const { ensureAuthenticated, bodyValidation } = require('../middlewares/validation');

// Get all posts
router.route('/').get(async(req, res) => {
  try {
    await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'comments likes',
        populate: {
          path: 'likes'
        }
      })
      .exec((err, posts) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (posts === null) return res.status(400).json('No any posts found');
        else return res.json(posts);
      });
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add new post
router.route('/add').post(ensureAuthenticated, async(req, res) => {
  try {
    const { error } = bodyValidation(req.body);
    if (error) return res.status(400).json({ bodyValidationError: error.details[0].message });
    else {
      const token = req.headers.token;
      await User.findById(token)
        .exec(async(err, user) => {
          if (err) return res.status(400).json('Error: ' + err);
          else if (user === null) return res.status(400).json('Internal error');
          else {
            const userName = user.userName;
            const body = req.body.body;
            const imageURL = user.imageURL;
            const userId = user._id;

            const newPost = new Post({
              userName,
              body,
              imageURL,
              userId
            });

            await newPost.save();

            user.posts.unshift(newPost._id);
            user.postCount = ++user.postCount;

            await user.save(() => {
              res.json(newPost);
            });
          }
        });
    }
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get one post by ID
router.route('/:id').get(async(req, res) => {
  try {
    await Post.findById(req.params.id)
      .populate({
        path: 'comments likes',
        populate: {
          path: 'likes'
        }
      })
      .exec((err, post) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (post === null) return res.status(400).json('No any posts found');
        else return res.json(post);
      });
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete one post
router.route('/:id').delete(ensureAuthenticated, async(req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id)
      .exec(async(err, post) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (post === null) return res.status(400).json('Post not found');
        else {
          await Like.deleteMany({ postId: post._id });
          // .exec((err, likes) => {
          //   if (err) return res.status(400).json('Error: ' + err);
          //   if (likes.nModified === 0) return res.status(400).json('Likes Not found');
          // });
          await Comment.deleteMany({ postId: post._id });
          // .exec((err, comments) => {
          //   if (err) return res.status(400).json('Error: ' + err);
          //   if (comments.nModified === 0) return res.status(400).json('Comments Not found');
          // });
          await User.findById(post.userId)
            .exec(async(err, user) => {
              if (err) return res.status(400).json('Error: ' + err);
              else if (user === null) return res.status(400).json('Internal error');
              else {
                const toDelete = user.posts.findIndex(deleteMe => {
                  return deleteMe.toString() === req.params.id;
                });
                if (toDelete === -1) return res.status(400).json('Post not found');
                else {
                  user.postCount = --user.postCount;
                  user.posts.splice(toDelete, 1);
                  await user.save(() => {
                    res.json('Post deleted');
                  });
                }
              }
            });
        }
      });
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Update Post
router.route('/update/:id').post(ensureAuthenticated, async(req, res) => {
  try {
    await Post.findById(req.params.id)
      .exec(async(err, post) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (post === null) return res.status(400).json('Post not found');
        else {
          const { error } = bodyValidation(req.body);
          if (error) return res.status(400).json(error.details[0].message);

          post.body = req.body.body;

          await post.save(() => {
            res.json('Post updated!');
          });
        }
      });
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
