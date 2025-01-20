import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  changePassword,
  deleteUser,
  deleteUserPhoto,
  getAllUsers,
  getUserByUuid,
  updateUser,
  updateUserPhoto,
} from '../../services/usersService';

const { USERS_SLICE_NAME } = sliceNames;

export const fetchUsers = createAsyncThunk(
  `${USERS_SLICE_NAME}/fetchAll`,
  async (
    {
      emailVerificationStatus = 'all',
      page = 1,
      limit = 6,
      sort = 'uuid',
      order = 'asc',
    },
    { rejectWithValue }
  ) => {
    try {
      const params = { emailVerificationStatus, page, limit, sort, order };
      const { data, totalCount } = await getAllUsers(params);
      return { data, totalCount };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserByUuid = createAsyncThunk(
  `${USERS_SLICE_NAME}/fetchByUuid`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      const { data } = await getUserByUuid(uuid);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editUser = createAsyncThunk(
  `${USERS_SLICE_NAME}/edit`,
  async ({ uuid, fullName, email, role }, { rejectWithValue }) => {
    try {
      const { data } = await updateUser(uuid, fullName, email, role);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  `${USERS_SLICE_NAME}/changePassword`,
  async ({ uuid, newPassword, confirmNewPassword }, { rejectWithValue }) => {
    try {
      const { data } = await changePassword(
        uuid,
        newPassword,
        confirmNewPassword
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editPhoto = createAsyncThunk(
  `${USERS_SLICE_NAME}/editPhoto`,
  async ({ uuid, userPhoto }, { rejectWithValue }) => {
    try {
      const { data } = await updateUserPhoto(uuid, userPhoto);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPhoto = createAsyncThunk(
  `${USERS_SLICE_NAME}/resetPhoto`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      const { data } = await deleteUserPhoto(uuid);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeUser = createAsyncThunk(
  `${USERS_SLICE_NAME}/remove`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      await deleteUser(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
