import { createSlice } from '@reduxjs/toolkit';

import { authApi, userProfileApi } from '../services';

const initialState = {
  authenticatedUser: null,
  isAuthenticated: false,
};

const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    logout(state) {
      state.authenticatedUser = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userProfileApi.endpoints.fetchUserProfile.matchFulfilled,
        (state, { payload }) => {
          state.authenticatedUser = payload;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.authenticatedUser = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authUserSlice.actions;
export default authUserSlice.reducer;
