import React, { Component } from 'react';
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// REdux
import { connect } from 'react-redux';
import { likePost, unlikePost } from '../../redux/actions/dataActions';

export class LikePostButton extends Component {
  constructor() {
    super();

    this.likedPost = this.likedPost.bind(this);
    this.likePost = this.likePost.bind(this);
    this.unlikePost = this.unlikePost.bind(this);

    this.state = {
      liked: false
    };
  }

  likedPost() {
    const userId = window.localStorage.getItem('currentUserId');
    const post = this.props.data.posts.find(post => post._id === this.props.postId);

    if (post.likes.length !== 0) {
      if (post.likes.find((like) => like.userId === userId.replace(/['"]+/g, ''))) {
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

  likePost() {
    this.props.likePost(this.props.postId);
  };

  unlikePost() {
    this.props.unlikePost(this.props.postId);
  };

  render() {
    const isAuthenticated = window.localStorage.getItem('token');
    const likeButton = !isAuthenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.likedPost() ? (
      <MyButton tip="Undo like" onClick={this.unlikePost}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likePost}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );
    return likeButton;
  }
}

LikePostButton.propTypes = {
  user: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data
});

const mapActionsToProps = {
  likePost,
  unlikePost
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(LikePostButton);
