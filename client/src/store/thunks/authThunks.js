import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  forgotPassword,
  login,
  logout,
  refreshAccessToken,
  registration,
  resetPassword,
} from '../../services/authService';

const { AUTH_SLICE_NAME } = sliceNames;

export const registrationThunk = createAsyncThunk(
  `${AUTH_SLICE_NAME}/registration`,
  async ({ fullName, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await registration(fullName, email, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginThunk = createAsyncThunk(
  `${AUTH_SLICE_NAME}/login`,
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await login(email, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  `${AUTH_SLICE_NAME}/logout`,
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshAccessTokenThunk = createAsyncThunk(
  `${AUTH_SLICE_NAME}/refresh`,
  async (_, { rejectWithValue }) => {
    try {
      const data = await refreshAccessToken();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  `${AUTH_SLICE_NAME}/forgotPassword`,
  async (email, { rejectWithValue }) => {
    try {
      const data = await forgotPassword(email);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  `${AUTH_SLICE_NAME}/resetPassword`,
  async ({ token, newPassword, confirmNewPassword }, { rejectWithValue }) => {
    try {
      const { data } = await resetPassword(
        token,
        newPassword,
        confirmNewPassword
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
