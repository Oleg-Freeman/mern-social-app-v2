import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  GET_USER_NOTIFICATIONS
} from '../types';

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  userId: 'testId'
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        credentials: { ...action.payload }
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    case GET_USER_NOTIFICATIONS: {
      state.notifications.push({ test: 'test' });
      return {
        ...state
      };
    }
    case MARK_NOTIFICATIONS_READ: {
      console.log('state.notifications', state.notifications);
      state.notifications.forEach((not) => (not.read = true));
      return {
        ...state
      };
    }
    default:
      return state;
  }
}
