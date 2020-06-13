import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MyButton from '../../util/MyButton';
import DeletePost from './DeletePost';
import PostDialog from './PostDialog';
import LikePostButton from './LikePostButton';

// MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// Icons
import ChatIcon from '@material-ui/icons/Chat';
// Redux
import { connect } from 'react-redux';

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20
  },
  image: {
    minWidth: 150
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};

class Post extends Component {
  constructor() {
    super();

    this.state = {
      likeCount: 0
    };
  }

  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      post: {
        body,
        userName,
        imageURL,
        createdAt,
        _id,
        likeCount,
        commentCount,
        userId
      }
    } = this.props;

    const isAuthenticated = window.localStorage.getItem('token');
    const currentUserId = window.localStorage.getItem('currentUserId');

    const deleteButton = isAuthenticated && currentUserId.replace(/['"]+/g, '') === userId ? (
      <DeletePost postId={_id} />
    ) : null;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={imageURL}
          title="Profile image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userId}`}
            color="primary"
          >
            {userName}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          <LikePostButton postId={_id} />
          <span>{likeCount} Likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
          <PostDialog
            postId={_id}
            userId={userId}
            openDialog={this.props.openDialog}
          />
        </CardContent>
      </Card>
    );
  }
}
Post.propTypes = {
  card: PropTypes.string,
  image: PropTypes.string,
  content: PropTypes.string,
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
