const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  userName: {
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
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comments'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Likes'
  }]
}, {
  timestamps: true
});

const Post = mongoose.model('Posts', postSchema);

module.exports = Post;
