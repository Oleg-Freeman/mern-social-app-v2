import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Post from '../components/post/post.component';
import StaticProfile from '../components/profile/StaticProfile';
import Grid from '@material-ui/core/Grid';

// Redux Stuff
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class User extends Component {
  constructor() {
    super();

    this.state = {
      profile: null,
      postIdParam: null
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    const postId = this.props.match.params.postId;
    const baseURL = 'https://floating-eyrie-36313.herokuapp.com/';
    // http://localhost:5000/

    if (postId) this.setState({ postIdParam: postId });

    this.props.getUserData(userId);
    axios
      .get(`${baseURL}users/${userId.replace(/['"]+/g, '')}`)
      .then((res) => {
        this.setState({
          profile: res.data
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { posts, loading } = this.props.data;
    const { postIdParam } = this.state;

    const postsMarkup = loading ? (
      <p>Loading data...</p>
    ) : posts === null ? (
      <p>No posts from this user</p>
    ) : !postIdParam ? (
      posts.map((post, index) => <Post key={index} post={post} />)
    ) : (
      posts.map((post, index) => {
        if (post._id !== postIdParam) return <Post key={index} post={post} />;
        else return <Post key={post._id} post={post} openDialog />;
      })
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {postsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <p>Loading profile...</p>
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

User.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getUserData }
)(User);
