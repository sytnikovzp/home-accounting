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
  async (params, { rejectWithValue }) => {
    try {
      return await getAllCategories(params);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCategoryByUuid = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/fetchByUuid`,
  async (uuid, { rejectWithValue }) => {
    try {
      return await getCategoryByUuid(uuid);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCategory = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/add`,
  async (title, { rejectWithValue }) => {
    try {
      return await createCategory(title);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editCategory = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/edit`,
  async ({ uuid, title }, { rejectWithValue }) => {
    try {
      return await updateCategory(uuid, title);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeCategory = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/remove`,
  async (uuid, { rejectWithValue }) => {
    try {
      return await deleteCategory(uuid);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
