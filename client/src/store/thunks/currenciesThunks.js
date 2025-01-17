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
  async (
    { page = 1, limit = 6, sort = 'uuid', order = 'asc' },
    { rejectWithValue }
  ) => {
    try {
      const params = { page, limit, sort, order };
      const { data, totalCount } = await getAllCurrencies(params);
      return {
        data,
        totalCount,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCurrencyByUuid = createAsyncThunk(
  `${CURRENCIES_SLICE_NAME}/fetchByUuid`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      const { data } = await getCurrencyByUuid(uuid);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCurrency = createAsyncThunk(
  `${CURRENCIES_SLICE_NAME}/add`,
  async ({ title, code }, { rejectWithValue }) => {
    try {
      const { data } = await createCurrency(title, code);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editCurrency = createAsyncThunk(
  `${CURRENCIES_SLICE_NAME}/edit`,
  async ({ uuid, title, code }, { rejectWithValue }) => {
    try {
      const { data } = await updateCurrency(uuid, title, code);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeCurrency = createAsyncThunk(
  `${CURRENCIES_SLICE_NAME}/remove`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      await deleteCurrency(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
