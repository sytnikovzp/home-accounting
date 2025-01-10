import { createAsyncThunk } from '@reduxjs/toolkit';

import categoryService from '../../services/categoryService';

export const fetchCategories = createAsyncThunk(
  'categories/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAllCategories(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCategoryByUuid = createAsyncThunk(
  'categories/fetchByUuid',
  async (uuid, { rejectWithValue }) => {
    try {
      return await categoryService.getCategoryByUuid(uuid);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (title, { rejectWithValue }) => {
    try {
      return await categoryService.createCategory(title);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ uuid, title }, { rejectWithValue }) => {
    try {
      return await categoryService.updateCategory(uuid, title);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (uuid, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
