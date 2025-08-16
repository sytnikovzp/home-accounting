import { createSlice } from '@reduxjs/toolkit';

import { authApi, userProfileApi } from '@/src/store/services';

const initialState = {
  authenticatedUser: null,
  isAuthenticated: false,
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    clearAuthenticationState: () => initialState,
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

const { actions, reducer } = authenticationSlice;

export const { clearAuthenticationState } = actions;

export default reducer;
