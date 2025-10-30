import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage, // localStorage
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

// Action types
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
export const SET_USER_DATA = "SET_USER_DATA";

// Action creators
export const loginSuccess = (token, userData) => ({
  type: LOGIN_SUCCESS,
  payload: { token, userData },
});

export const logout = () => ({
  type: LOGOUT,
});

export const setUserData = (userData) => ({
  type: SET_USER_DATA,
  payload: userData,
});

// Reducer
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.userData,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
      };
    case SET_USER_DATA:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const persistedReducer = persistReducer(persistConfig, authReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
