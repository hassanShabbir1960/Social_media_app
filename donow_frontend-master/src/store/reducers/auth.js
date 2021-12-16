import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  token: localStorage.getItem("token ")?localStorage.getItem("token "):null,
  error: null,
  loading: true,
  loggedIn: false,
  user: {},
  user_status : null
};

const authStart = (state, action) => {
  return updateObject(state, {
    token: null,
    loading: true,
    user_status: null,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    user: action.user,
    user_status: action.user.user_status,
    loading: false,
    loggedIn: true,
  });
};

const authFail = (state, action) => {
  localStorage.removeItem("token");
  return updateObject(state, {
    error: action.error,
    loading: false,
    loggedIn: false,
    token: null,
    user: {},
    user_status: null,
  });
};

const authLogout = (state, action) => {
  // localStorage.removeItem('token');
  return updateObject(state, {
    token: null,
    user: {},
    user_status: null,
    loggedIn: false,
    error: null,
  });
};

const userLoadStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const userLoadFinished = (state, action) => {
  // console.log(action.data)
  return updateObject(state, {
    user: action.user,
    user_status: action.user.user_status,
    loading: false,
    // loggedIn: true
  });
};
const waitforActivation = (state, actions) => {
  return updateObject(state, {
    WaitforActivation: true,
  });
};
const userLoadFailed = (state, action) => {
  return updateObject(state, {
    error: action.error,
    user_status: null,
    user: {},
    loggedIn: false,
    token: null,
    loading: false,
  });
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.USER_LOADING:
      return userLoadStart(state);
    case actionTypes.USER_LOADED:
      return userLoadFinished(state, action);
    case actionTypes.USER_LOADING_FAILED:
      return userLoadFailed(state, action);
    case actionTypes.WAIT_FOR_ACTIVATION:
      return waitforActivation(state, action);

    default:
      return state;
  }
};

export default authReducer;
