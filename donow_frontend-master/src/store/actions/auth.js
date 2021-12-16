import * as actionTypes from "./actionTypes";
import axios from "axios";
import { getError } from "./errors";
import StaticData from "../../components/StaticData";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, user, user_status) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token,
    user,
    user_status
  };
};
export const authWaitforActivate = (user) => {
  return {
    type: actionTypes.WAIT_FOR_ACTIVATION,
  };
};
export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const userLoadStart = () => {
  return {
    type: actionTypes.USER_LOADING,
  };
};
export const userLoadFinished = (user) => {
  return {
    type: actionTypes.USER_LOADED,
    user,
  };
};
export const userLoadFailed = (error) => {
  return {
    type: actionTypes.USER_LOADING_FAILED,
    error,
  };
};

export const sessionTimeOut = () => {
  return {
    type: actionTypes.SESSION_TIMEOUT,
  };
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authLogout = () => {
  return (dispatch, getState) => {
    const token = getState().authReducer.token;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    //if token, add to header
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    axios
      .post(StaticData.BEURL + "/auth/rest-auth/logout/", config)
      .then((res) => {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");
        // alert(res.data.detail);
        dispatch(logout());
      })
      .catch((err) => {
        console.log(err);
        if (err.response)
          dispatch(getError(err.response.data, err.response.status));
      });
  };
};

// export const checkAuthTimeout = (expirationTime) => {
//   return (dispatch) => {
//     setTimeout(() => {
//       dispatch(sessionTimeOut());
//       dispatch(logout());
//     }, expirationTime * 1000);
//   };
// };

export const authLogin = (username, password, userType) => {
  return (dispatch) => {
    dispatch(authStart());
    let loginURL;
    if (userType === "ADMIN") {
      loginURL = StaticData.BEURL + "/auth/rest-auth/admin-login";
    } else {
      loginURL = StaticData.BEURL + "/auth/rest-auth/login";
    }
    axios
      .post(loginURL, {
        username,
        password,
      })
      .then((res) => {
        const token = res.data.token;
        const user = res.data.user;
        // alert(status)
        // console.log(userId);
        // if (userType === "NONADMIN") {
          // alert('non-admin logged in')
          // const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
          // alert(localStorage.getItem("token"))
          // localStorage.setItem("expirationDate", expirationDate);
        // }
        dispatch(authSuccess(token, user));
        // dispatch(checkAuthTimeout(3600));
        // history.push('/')
      })
      .catch((err) => {
        if (err.response !== undefined) {
          if (err.response.data["non_field_errors"]) {
            console.log(err.response.data["non_field_errors"][0]);
            dispatch(getError(err.response.data["non_field_errors"][0]));
            dispatch(authFail(err.response.data["non_field_errors"][0]));
            if (
              err.response.data["non_field_errors"][0] ===
              "Account Not Activated"
            ) {
              // console.log("Redirecting");
              window.location.pathname = "/test/verify-email";
            }
          } else {
            // alert(err.response.data)
            dispatch(authFail(err.response.data.substring(0, 31)));
            dispatch(getError(err.response.data, err.response.status));
          }
        } else {
          // dispatch(authFail(err.message));
          dispatch(getError(err, null));
        }
      });
  };
};

export const authSignup = (
  firstname,
  lastname,
  username,
  email,
  password,
  bio
) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(StaticData.BEURL + "/auth/rest-auth/register", {
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        password: password,
        bio: bio,
      })
      .then((res) => {
        const token = res.data.token;
        const user = res.data.user;
        // const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        dispatch(authWaitforActivate(user));
        localStorage.setItem("token", token);
        // localStorage.setItem("expirationDate", expirationDate);
        // dispatch(authSuccess(token, user));
        // dispatch(checkAuthTimeout(3600));
      })
      .catch((err) => {
        dispatch(authFail(err));
        if (err.response !== undefined) {
          console.log(err.response.data);
          dispatch(getError(err.response.data, err.response.status));
        } else {
          dispatch(getError(err, null));
        }
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === null || undefined) {
      dispatch(logout());
    } else {
      // const expirationDate = new Date(localStorage.getItem("expirationDate"));
      // if (expirationDate <= new Date()) {
      //   // console.log('token expired')
      //   dispatch(logout());}
      //  {
      let user = {
        user_status: null
      }
      dispatch(authSuccess(token, user));
      // dispatch(
      //   checkAuthTimeout(
      //     (expirationDate.getTime() - new Date().getTime()) / 1000
      //   )
      // );
      // }
    }
  };
};

//user get actions
export const loadUser = () => (dispatch, getState) => {
  dispatch(userLoadStart());
  //dispatch action that user is being loaded
  const token = getState().authReducer.token;
  // console.log(token)
  //-->FOR TOKEN AUTHORIZATION MAKING HEADER
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //if token, add to header
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  axios
    .get(StaticData.BEURL + "/auth/rest-auth/user", config)
    .then((res) => {
      console.log(res.data.user_status)
      // console.log(res.data)
      dispatch(userLoadFinished(res.data));
      // console.log(res.data)
    })
    .catch((err) => {
      dispatch(userLoadFailed(""));
      // dispatch(logout())
      if (err.response)
        dispatch(getError(err.response.data, err.response.status));
    });
};
