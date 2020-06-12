import {
  SET_POST,
  LOADING_DATA,
  ADD_POST,
  SET_POSTS,
  ADD_COMMENT,
  LIKE_POST,
  UNLIKE_POST,
  DELETE_POST,
  DELETE_COMMENT,
  LIKE_COMMENT,
  UNLIKE_COMMENT
} from '../types';

const initialState = {
  posts: [],
  post: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_POSTS: {
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    }
    case SET_POST:
      return {
        ...state,
        post: action.payload
      };
    case LIKE_POST: {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload.postId
      );

      state.posts[index].likeCount = ++state.posts[index].likeCount;
      state.posts[index].likes.unshift(action.payload);

      if (state.post.likes) {
        state.post.likeCount = ++state.post.likeCount;
        state.post.likes.unshift(action.payload);
      }

      return {
        ...state
      };
    }
    case UNLIKE_POST: {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload.postId
      );

      state.posts[index].likeCount = --state.posts[index].likeCount;

      const unlikeIndex = state.posts[index].likes.findIndex(
        (like) => like._id === action.payload.unlikeId
      );
      state.posts[index].likes.splice(unlikeIndex, 1);

      if (state.post.likes) {
        state.post.likeCount = --state.post.likeCount;
        state.post.likes.splice(unlikeIndex, 1);
      }

      return {
        ...state
      };
    }
    case DELETE_POST: {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload
      );
      state.posts.splice(index, 1);
      return {
        ...state
      };
    }
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case ADD_COMMENT: {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload.postId
      );
      state.posts[index].commentCount = ++state.posts[index].commentCount;
      state.post.commentCount = ++state.post.commentCount;
      return {
        ...state,
        post: {
          ...state.post,
          comments: [action.payload, ...state.post.comments]
        }
      };
    }
    case DELETE_COMMENT: {
      const postIndex = state.posts.findIndex(
        (post) => post._id === action.payload.postId
      );
      const commentIndex = state.posts[postIndex].comments.findIndex(
        (comment) => comment._id === action.payload.commentId
      );
      state.posts[postIndex].comments.splice(commentIndex, 1);
      state.posts[postIndex].commentCount = --state.posts[postIndex].commentCount;
      state.post.comments.splice(commentIndex, 1);
      state.post.commentCount = --state.post.commentCount;
      return {
        ...state
      };
    }
    case LIKE_COMMENT: {
      const postIndex = state.posts.findIndex(
        (post) => post._id === action.payload.postId
      );
      const commentIndex = state.posts[postIndex].comments.findIndex(
        (comment) => comment._id === action.payload.commentId
      );
      state.posts[postIndex].comments[commentIndex].likeCount = ++state.posts[postIndex].comments[commentIndex].likeCount;
      state.posts[postIndex].comments[commentIndex].likes.unshift(action.payload);

      state.post.comments[commentIndex].likeCount = ++state.post.comments[commentIndex].likeCount;
      state.post.comments[commentIndex].likes.unshift(action.payload);
      return {
        ...state
      };
    }
    case UNLIKE_COMMENT: {
      const postIndex = state.posts.findIndex(
        (post) => post._id === action.payload.postId
      );
      const commentIndex = state.posts[postIndex].comments.findIndex(
        (comment) => comment._id === action.payload.commentId
      );
      const unlikeIndex = state.posts[postIndex].comments[commentIndex].likes.findIndex(
        (like) => like._id === action.payload.unlikeId
      );
      state.posts[postIndex].comments[commentIndex].likeCount = --state.posts[postIndex].comments[commentIndex].likeCount;
      state.posts[postIndex].comments[commentIndex].likes.splice(unlikeIndex, 1);

      state.post.comments[commentIndex].likeCount = --state.post.comments[commentIndex].likeCount;
      state.post.comments[commentIndex].likes.splice(unlikeIndex, 1);
      return {
        ...state
      };
    }
    default:
      return state;
  }
}
