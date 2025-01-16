import { createAsyncThunk } from '@reduxjs/toolkit';

import { CURRENCIES_SLICE_NAME } from '../../constants';
import {
  createCurrency,
  deleteCurrency,
  getAllCurrencies,
  getCurrencyByUuid,
  updateCurrency,
} from '../../services/currenciesService';

export const fetchCurrencies = createAsyncThunk(
  `${CURRENCIES_SLICE_NAME}/fetchAll`,
  async ({ page, limit, sort, order }, { rejectWithValue }) => {
    try {
      const params = { page, limit, sort, order };
      const response = await getAllCurrencies(params);
      return {
        data: response.data,
        totalCount: response.totalCount,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCurrencyByUuid = createAsyncThunk(
  `${CURRENCIES_SLICE_NAME}/fetchByUuid`,
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await getCurrencyByUuid(uuid);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCurrency = createAsyncThunk(
  `${CURRENCIES_SLICE_NAME}/add`,
  async ({ title, code }, { rejectWithValue }) => {
    try {
      const response = await createCurrency(title, code);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editCurrency = createAsyncThunk(
  `${CURRENCIES_SLICE_NAME}/edit`,
  async ({ uuid, title, code }, { rejectWithValue }) => {
    try {
      const response = await updateCurrency(uuid, title, code);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeCurrency = createAsyncThunk(
  `${CURRENCIES_SLICE_NAME}/remove`,
  async (uuid, { rejectWithValue }) => {
    try {
      await deleteCurrency(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
