import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import DeleteComment from './DeleteComment';
import LikeCommentButton from './LikeCommentButton';
// MUI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  // ...theme,
  commentImage: {
    maxWidth: '100%',
    height: 100,
    objectFit: 'cover',
    borderRadius: '50%'
    // marginLeft: 20
  },
  commentData: {
    marginLeft: 20
  }
});

class Comments extends Component {
  render() {
    const isAuthenticated = window.localStorage.getItem('token');
    const currentUserId = window.localStorage.getItem('currentUserId');
    const { comments, classes } = this.props;

    return (
      <Grid container>
        {comments.map((comment, index) => {
          const { body, createdAt, imageURL, userName, _id, likeCount, postId, userId } = comment;
          return (
            <Fragment key={createdAt}>
              <Grid item sm={12}>
                <Grid container>
                  <Grid item sm={2}>
                    <img
                      src={imageURL}
                      alt="comment"
                      className={classes.commentImage}
                    />
                  </Grid>
                  <Grid item sm={9}>
                    <div className={classes.commentData}>
                      <Typography
                        variant="h5"
                        component={Link}
                        to={`/users/${userId}`}
                        color="primary"
                      >
                        {userName}
                      </Typography>
                      {isAuthenticated && currentUserId.replace(/['"]+/g, '') === userId ? (
                        <DeleteComment postId={postId} commentId={_id} />
                      ) : null}
                      <LikeCommentButton commentId={_id} postId={postId} />
                      <span>{likeCount} likes</span>
                      <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                      </Typography>
                      <hr className={classes.invisibleSeparator} />
                      <Typography variabnt="body1">{body}</Typography>

                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {index !== comments.length - 1 && (
                <hr className={classes.visibleSeparator} />
              )}
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
  // postId: PropTypes.string.isRequired,
  // userId: PropTypes.string.isRequired
};

export default withStyles(styles)(Comments);
