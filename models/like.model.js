const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likeSchema = new Schema({
  postId: {
    type: String,
    required: true
  },
  commentId: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  likeType: {
    type: String,
    enum: ['post', 'comment'],
    required: true
  }
}, {
  timestamps: true
});

const Like = mongoose.model('Likes', likeSchema);

module.exports = Like;
