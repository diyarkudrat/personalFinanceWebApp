import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from './types';

// Register user
export const registerUser = (userData, history) => dispatch => {
    axios
      .post('/api/users/signup', userData)
      .then(res => history.push('/login'))
      .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

// GET logged-in user token
export const loginUser = userData => dispatch => {
    axios
      .post('/api/users/login', userData)
      .then(res => {
          // set token to localStorage
          const { token } = res.data;
          localStorage.setItem('jwtToken', token);
          // set token to Auth header
          setAuthToken(token);
          // decode token to get user data
          const decoded = jwt_decode(token);
          // set current user
          dispatch(setCurrentUser(decoded));
      })
      .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
}

// set logged-in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// user loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

// log out user
export const logoutUser = () => dispatch => {
    // remove token from local storage
    localStorage.removeItem("jwtToken");
    // remove auth header for future requests
    setAuthToken(false);
    // set user to empty object which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
}
