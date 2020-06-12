/* eslint-disable camelcase */
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';

// MUI Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux stuff
import { connect } from 'react-redux';
import { registerUser } from '../redux/actions/userActions';

const styles = (theme) => ({
  form: {
    textAlign: 'center'
  },
  image: {
    margin: '10px auto 5px auto',
    height: 50
  },
  pageTitle: {
    margin: '5px auto 10px auto'
  },
  textField: {
    margin: '10px auto 10px auto'
  },
  button: {
    marginTop: 20,
    position: 'relative'
  },
  customError: {
    color: 'red',
    fontSize: '1rem',
    marginTop: 10
  },
  progress: {
    position: 'absolute'
  }
});

class Register extends Component {
  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      email: '',
      password: '',
      password2: '',
      userName: '',
      errors: {
        email: '',
        password: '',
        password2: '',
        userName: '',
        message: ''
      }
    };
  }

  componentDidMount() {
    if (window.localStorage.getItem('token')) {
      this.props.history.push('/');
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      userName: this.state.userName
    };
    this.props.registerUser(newUserData, this.props.history);
  };

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { classes, UI: { loading } } = this.props;
    const { errors } = this.state;

    // const isAuthenticated = window.localStorage.getItem('isAuthenticated');
    // if (isAuthenticated) return this.props.history.push('/');

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="lambda" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
          Register
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email}
              error={!!errors.email}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password}
              error={!!errors.password}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="password2"
              name="password2"
              type="password"
              label="Confirm Password"
              className={classes.textField}
              helperText={errors.password2}
              error={!!errors.password2}
              value={this.state.password2}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="userName"
              name="userName"
              type="text"
              label="User Name"
              className={classes.textField}
              helperText={errors.userName}
              error={!!errors.userName}
              value={this.state.userName}
              onChange={this.handleChange}
              fullWidth
            />
            <Typography variant="body2" className={classes.customError}>
              {this.state.errors.message}
            </Typography>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
            Register
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}
Register.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  registerUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withStyles(styles)(Register));
