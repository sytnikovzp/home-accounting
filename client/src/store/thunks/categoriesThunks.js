import { createAsyncThunk } from '@reduxjs/toolkit';

import { CATEGORIES_SLICE_NAME } from '../../constants';
import categoryService from '../../services/categoryService';

export const fetchCategories = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/fetch`,
  async (params, { rejectWithValue }) => {
    try {
      return await categoryService.getAllCategories(params);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCategoryByUuid = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/fetchByUuid`,
  async (uuid, { rejectWithValue }) => {
    try {
      return await categoryService.getCategoryByUuid(uuid);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCategory = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/create`,
  async (title, { rejectWithValue }) => {
    try {
      return await categoryService.createCategory(title);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editCategory = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/edit`,
  async ({ uuid, title }, { rejectWithValue }) => {
    try {
      return await categoryService.updateCategory(uuid, title);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  `${CATEGORIES_SLICE_NAME}/delete`,
  async (uuid, { rejectWithValue }) => {
    try {
      return await categoryService.deleteCategory(uuid);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
