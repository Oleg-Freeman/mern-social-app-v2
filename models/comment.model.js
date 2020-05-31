const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  postId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  likeCount: {
    type: Number,
    required: true,
    default: 0
  },
  commentCount: {
    type: Number,
    required: true,
    default: 0
  },
  imageURL: {
    type: String,
    required: true,
    default: 'https://res.cloudinary.com/freeman999/image/upload/v1589014461/noAvatar2_skj96w.png'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Likes'
  }]
  // TO DO: Comments on comments
}, {
  timestamps: true
});

const Comment = mongoose.model('Comments', commentSchema);

module.exports = Comment;
