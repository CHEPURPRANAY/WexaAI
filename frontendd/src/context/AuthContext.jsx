import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api/axios';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  isAuthenticated: false,
};

// Action types
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAILURE = 'AUTH_FAILURE';
const LOGOUT = 'LOGOUT';
const SET_LOADING = 'SET_LOADING';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          dispatch({
            type: AUTH_SUCCESS,
            payload: {
              user: response.data.data.user,
              token,
            },
          });
        } catch (error) {
          dispatch({ type: AUTH_FAILURE });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        dispatch({ type: SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, []);

  // Login action
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user, token },
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_FAILURE });
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Signup action
  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user, token },
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_FAILURE });
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: LOGOUT });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
