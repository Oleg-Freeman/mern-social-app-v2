const router = require('express').Router();
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const { ensureAuthenticated, bodyValidation } = require('../middlewares/validation');

// Get all comments from DB
router.route('/').get(async(req, res) => {
  try {
    await Comment.find().sort({ createdAt: -1 })
      .populate('likes')
      .exec((err, comments) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (comments === null || comments.length === 0) return res.status(400).json('No any comments found');
        else return res.json(comments);
      });
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get all comments on post
router.route('/:postId').get(async(req, res) => {
  try {
    await Comment.find({ postId: req.param.postId })
      .sort({ createdAt: -1 })
      .populate('likes')
      .exec((err, comments) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (comments === null || comments.length === 0) return res.status(400).json('No any comments on this post found');
        else return res.json(comments);
      });
  }
  catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add new comment
router.route('/add/:postId').post(ensureAuthenticated, async(req, res) => {
  const { error } = bodyValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  else {
    try {
      const token = req.headers.token;
      await User.findById(token)
        .exec(async(err, user) => {
          if (err) return res.status(400).json('Error: ' + err);
          else if (user === null) return res.status(400).json('Internal error');
          else {
            await Post.findById(req.params.postId)
              .exec(async(err, post) => {
                if (err) return res.status(400).json('Error: ' + err);
                else if (post === null) return res.status(400).json('Internal error');
                else {
                  const userName = user.userName;
                  const body = req.body.body;
                  const postId = req.params.postId;
                  const userId = user._id;
                  const imageURL = user.imageURL;

                  const newComment = new Comment({
                    postId,
                    userId,
                    userName,
                    body,
                    imageURL
                  });

                  post.comments.unshift(newComment._id);
                  post.commentCount = ++post.commentCount;

                  await post.save();

                  await newComment.save(() => {
                    res.json(newComment);
                  });
                }
              });
          }
        });
    }
    catch (err) {
      res.status(400).json('Error: ' + err);
    }
  }
});

// Delete comment
router.route('/:commentId').delete(ensureAuthenticated, async(req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId)
      .exec(async(err, comment) => {
        if (err) return res.status(400).json('Error: ' + err);
        else if (comment === null) return res.status(400).json('Comments not found');
        else {
          await Post.findById(comment.postId)
            .exec(async(err, post) => {
              if (err) return res.status(400).json('Error: ' + err);
              else if (post === null) return res.status(400).json('Internal error');
              else {
                const toDelete = post.comments.findIndex(deleteMe => {
                  return deleteMe.toString() === req.params.commentId;
                });
                if (toDelete === -1) throw new Error('Comment not found');
                else {
                  post.commentCount = --post.commentCount;
                  post.comments.splice(toDelete, 1);
                  await post.save(() => {
                    res.json('Comment deleted');
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

// Update comment
router.route('/update/:commentId').post(ensureAuthenticated, async(req, res) => {
  const { error } = bodyValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  else {
    try {
      await Comment.findOneAndUpdate({ _id: req.params.commentId }, { body: req.body.body })
        .exec((err, comment) => {
          if (err) return res.status(400).json('Error: ' + err);
          else if (comment === null) return res.status(400).json('Comment not found');
          else return res.json('Comment updated!');
        });
    }
    catch (err) {
      res.status(400).json('Error: ' + err);
    }
  }
});

module.exports = router;
