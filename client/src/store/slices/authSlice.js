import { createSlice } from '@reduxjs/toolkit';

import { authApi, userProfileApi } from '../services';

const initialState = {
  currentUser: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userProfileApi.endpoints.fetchUserProfile.matchFulfilled,
        (state, { payload }) => {
          state.currentUser = payload;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
