import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  changePassword,
  changeUserPhoto,
  deleteUser,
  getUserProfile,
  resetUserPhoto,
  updateUser,
} from '../../services/userProfileService';

const { USER_PROFILE_SLICE_NAME } = sliceNames;

export const fetchUserProfile = createAsyncThunk(
  `${USER_PROFILE_SLICE_NAME}/fetch`,
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserProfile();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  `${USER_PROFILE_SLICE_NAME}/changePassword`,
  async ({ newPassword, confirmNewPassword }, { rejectWithValue }) => {
    try {
      const { data } = await changePassword(newPassword, confirmNewPassword);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editUser = createAsyncThunk(
  `${USER_PROFILE_SLICE_NAME}/edit`,
  async ({ fullName, email, role }, { rejectWithValue }) => {
    try {
      const { data } = await updateUser(fullName, email, role);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changePhoto = createAsyncThunk(
  `${USER_PROFILE_SLICE_NAME}/changePhoto`,
  async ({ userPhoto }, { rejectWithValue }) => {
    try {
      const { data } = await changeUserPhoto(userPhoto);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPhoto = createAsyncThunk(
  `${USER_PROFILE_SLICE_NAME}/resetPhoto`,
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await resetUserPhoto();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeUser = createAsyncThunk(
  `${USER_PROFILE_SLICE_NAME}/remove`,
  async (_, { rejectWithValue }) => {
    try {
      await deleteUser();
      return null;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
