import { createAsyncThunk } from '@reduxjs/toolkit';

import { CATEGORIES_SLICE_NAME } from '../../constants';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryByUuid,
  updateCategory,
} from '../../services/categoriesService';

export const fetchCategories = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/fetchAll`,
  async (
    { status = 'approved', page = 1, limit = 6, sort = 'uuid', order = 'asc' },
    { rejectWithValue }
  ) => {
    try {
      const params = { status, page, limit, sort, order };
      const { data, totalCount } = await getAllCategories(params);
      return {
        data,
        totalCount,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCategoryByUuid = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/fetchByUuid`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      const { data } = await getCategoryByUuid(uuid);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCategory = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/add`,
  async ({ title }, { rejectWithValue }) => {
    try {
      const { data } = await createCategory(title);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editCategory = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/edit`,
  async ({ uuid, title }, { rejectWithValue }) => {
    try {
      const { data } = await updateCategory(uuid, title);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeCategory = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/remove`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      await deleteCategory(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
