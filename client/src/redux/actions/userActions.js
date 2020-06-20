import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  GET_USER_NOTIFICATIONS
} from '../types';
import axios from 'axios';
const baseURL = '/';

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.post(`${baseURL}users/login`, userData)
    .then(res => {
      if (res.data.authenticated) {
        dispatch({ type: CLEAR_ERRORS });
        // dispatch({ type: SET_AUTHENTICATED });
        history.push('/');
      }
      else {
        dispatch({ type: CLEAR_ERRORS });
        window.localStorage.setItem('token', JSON.stringify(res.data.token)); // JSON.stringify(res.data._id)
        window.localStorage.setItem('currentUserId', JSON.stringify(res.data.userId));
        // dispatch({ type: SET_AUTHENTICATED });
        dispatch({
          type: SET_USER,
          payload: res.data
        });
        history.push('/');
      }
    }).catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const registerUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.post(`${baseURL}users/register`, newUserData)
    .then((res) => {
      dispatch({ type: CLEAR_ERRORS });
      history.push('/login');
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const logoutUser = (history) => () => {
  const currentUserId = window.localStorage.getItem('currentUserId');
  axios.get(`${baseURL}users/logout/${currentUserId.replace(/['"]+/g, '')}`)
    .then(res => {
      console.log(res.data);
      if (res.data.notAuthenticated) {
        window.localStorage.removeItem('currentUserId');
        window.localStorage.removeItem('token');
        history.push('/login');
      }
      if (res.data.loggedOut) {
      // dispatch({ type: SET_UNAUTHENTICATED });
        window.localStorage.removeItem('currentUserId');
        window.localStorage.removeItem('token');
        console.log('Logged out');
        // history.push('/');
        window.location.reload();
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const getUserData = (userId) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  if (userId) {
    axios
      .get(`${baseURL}users/${userId.replace(/['"]+/g, '')}`)
      .then((res) => {
        dispatch({
          type: SET_USER,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
  }
  else {
    dispatch({
      type: SET_USER,
      payload: ''
    });
  }
};

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  const currentUserId = window.localStorage.getItem('currentUserId');
  const token = window.localStorage.getItem('token');
  axios({
    method: 'post',
    url: `${baseURL}users/image`,
    data: formData,
    headers: { token: token.replace(/['"]+/g, '') }
  })
    .then(() => {
      dispatch(getUserData(currentUserId.replace(/['"]+/g, '')));
    })
    .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  const currentUserId = window.localStorage.getItem('currentUserId');
  const token = window.localStorage.getItem('token');
  axios({
    method: 'post',
    url: `${baseURL}users/update/${currentUserId.replace(/['"]+/g, '')}`,
    data: userDetails,
    headers: { token: token.replace(/['"]+/g, '') }
  })
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
      console.log('User detail updated');
    })
    .catch((err) => console.log(err));
};

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  console.log('mark notifications?');
  const token = window.localStorage.getItem('token');
  axios({
    method: 'post',
    url: `${baseURL}notifications`,
    data: notificationIds,
    headers: { token: token.replace(/['"]+/g, '') }
  })
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: MARK_NOTIFICATIONS_READ
      });
    })
    .catch((err) => console.log(err));
};

export const getUserNotifications = (userId) => (dispatch) => {
  const token = window.localStorage.getItem('token');
  axios({
    method: 'get',
    url: `${baseURL}notifications/${userId}`,
    headers: { token: token.replace(/['"]+/g, '') }
  })
    .then((res) => {
      dispatch({
        type: GET_USER_NOTIFICATIONS,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};
