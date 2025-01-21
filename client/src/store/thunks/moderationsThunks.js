import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  getAllPendingItems,
  moderationCategory,
  moderationEstablishment,
  moderationProduct,
} from '../../services/moderationsService';

const { MODERATIONS_SLICE_NAME } = sliceNames;

export const fetchModerations = createAsyncThunk(
  `${MODERATIONS_SLICE_NAME}/fetchAll`,
  async (
    { page = 1, limit = 6, sort = 'uuid', order = 'asc' },
    { rejectWithValue }
  ) => {
    try {
      const params = { page, limit, sort, order };
      const { data, totalCount } = await getAllPendingItems(params);
      return { data, totalCount };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const moderateCategory = createAsyncThunk(
  `${MODERATIONS_SLICE_NAME}/category`,
  async ({ categoryUuid, status }, { rejectWithValue }) => {
    try {
      const { data } = await moderationCategory(categoryUuid, status);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const moderateEstablishment = createAsyncThunk(
  `${MODERATIONS_SLICE_NAME}/establishment`,
  async ({ establishmentUuid, status }, { rejectWithValue }) => {
    try {
      const { data } = await moderationEstablishment(establishmentUuid, status);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const moderateProduct = createAsyncThunk(
  `${MODERATIONS_SLICE_NAME}/product`,
  async ({ productUuid, status }, { rejectWithValue }) => {
    try {
      const { data } = await moderationProduct(productUuid, status);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
