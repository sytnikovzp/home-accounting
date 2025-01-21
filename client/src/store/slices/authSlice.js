import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import {
  forgotPasswordThunk,
  loginThunk,
  logoutThunk,
  refreshAccessTokenThunk,
  registrationThunk,
  resetPasswordThunk,
} from '../thunks/authThunks';

const { AUTH_SLICE_NAME } = sliceNames;

const initialState = {
  user: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Slice
const authSlice = createSlice({
  name: AUTH_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(registrationThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.permissions = payload.permissions;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.permissions = payload.permissions;
        state.isAuthenticated = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
        state.permissions = [];
        state.isAuthenticated = false;
      })
      .addCase(refreshAccessTokenThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.permissions = payload.permissions;
        state.isAuthenticated = true;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
        state.permissions = [];
        state.isAuthenticated = false;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
        state.permissions = [];
        state.isAuthenticated = false;
      })

      // Pending
      .addCase(registrationThunk.pending, setLoadingState)
      .addCase(loginThunk.pending, setLoadingState)
      .addCase(forgotPasswordThunk.pending, setLoadingState)
      .addCase(resetPasswordThunk.pending, setLoadingState)

      // Rejected
      .addCase(registrationThunk.rejected, setErrorState)
      .addCase(loginThunk.rejected, setErrorState)
      .addCase(logoutThunk.rejected, setErrorState)
      .addCase(refreshAccessTokenThunk.rejected, setErrorState)
      .addCase(forgotPasswordThunk.rejected, setErrorState)
      .addCase(resetPasswordThunk.rejected, setErrorState);
  },
});

export default authSlice.reducer;
