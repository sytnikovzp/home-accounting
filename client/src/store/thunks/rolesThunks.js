import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleByUuid,
  updateRole,
} from '../../services/rolesService';

const { ROLES_SLICE_NAME } = sliceNames;

export const fetchRoles = createAsyncThunk(
  `${ROLES_SLICE_NAME}/fetchAll`,
  async (
    { page = 1, limit = 6, sort = 'uuid', order = 'asc' },
    { rejectWithValue }
  ) => {
    try {
      const params = { page, limit, sort, order };
      const { data, totalCount } = await getAllRoles(params);
      return { data, totalCount };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRoleByUuid = createAsyncThunk(
  `${ROLES_SLICE_NAME}/fetchByUuid`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      const { data } = await getRoleByUuid(uuid);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addRole = createAsyncThunk(
  `${ROLES_SLICE_NAME}/add`,
  async ({ title, description, permissions }, { rejectWithValue }) => {
    try {
      const { data } = await createRole(title, description, permissions);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editRole = createAsyncThunk(
  `${ROLES_SLICE_NAME}/edit`,
  async ({ uuid, title, description, permissions }, { rejectWithValue }) => {
    try {
      const { data } = await updateRole(uuid, title, description, permissions);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeRole = createAsyncThunk(
  `${ROLES_SLICE_NAME}/remove`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      await deleteRole(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
