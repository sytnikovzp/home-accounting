import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductByUuid,
  updateProduct,
} from '../../services/productsService';

const { PRODUCTS_SLICE_NAME } = sliceNames;

export const fetchProducts = createAsyncThunk(
  `${PRODUCTS_SLICE_NAME}/fetchAll`,
  async (
    { status = 'approved', page = 1, limit = 6, sort = 'uuid', order = 'asc' },
    { rejectWithValue }
  ) => {
    try {
      const params = { status, page, limit, sort, order };
      const { data, totalCount } = await getAllProducts(params);
      return { data, totalCount };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductByUuid = createAsyncThunk(
  `${PRODUCTS_SLICE_NAME}/fetchByUuid`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      const { data } = await getProductByUuid(uuid);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addProduct = createAsyncThunk(
  `${PRODUCTS_SLICE_NAME}/add`,
  async ({ title, category }, { rejectWithValue }) => {
    try {
      const { data } = await createProduct(title, category);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editProduct = createAsyncThunk(
  `${PRODUCTS_SLICE_NAME}/edit`,
  async ({ uuid, title, category }, { rejectWithValue }) => {
    try {
      const { data } = await updateProduct(uuid, title, category);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeProduct = createAsyncThunk(
  `${PRODUCTS_SLICE_NAME}/remove`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      await deleteProduct(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
