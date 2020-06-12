import React, { Component } from 'react';
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// REdux
import { connect } from 'react-redux';
import { likeComment, unlikeComment } from '../../redux/actions/dataActions';

export class LikeCommentButton extends Component {
  constructor() {
    super();

    this.likedComment = this.likedComment.bind(this);
    this.likeComment = this.likeComment.bind(this);
    this.unlikeComment = this.unlikeComment.bind(this);

    this.state = {
      liked: false
    };
  }

  likedComment() {
    const userId = window.localStorage.getItem('currentUserId');
    const pId = this.props.data.posts.findIndex(post => post._id === this.props.postId);
    const comment = this.props.data.posts[pId].comments.find(comment => comment._id === this.props.commentId);
    if (comment) {
      if (comment.likes.find(like => like.userId === userId.replace(/['"]+/g, ''))) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  };

  likeComment() {
    this.props.likeComment(this.props.commentId);
  };

  unlikeComment() {
    this.props.unlikeComment(this.props.commentId);
  };

  render() {
    const isAuthenticated = window.localStorage.getItem('token');
    const likeButton = !isAuthenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.likedComment() ? (
      <MyButton tip="Undo like" onClick={this.unlikeComment}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeComment}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );
    return likeButton;
  }
}

LikeCommentButton.propTypes = {
  user: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  commentId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  likeComment: PropTypes.func.isRequired,
  unlikeComment: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data
});

const mapActionsToProps = {
  likeComment,
  unlikeComment
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(LikeCommentButton);
