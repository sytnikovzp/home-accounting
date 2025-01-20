import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getExpenseByUuid,
  updateExpense,
} from '../../services/expensesService';

const { EXPENSES_SLICE_NAME } = sliceNames;

export const fetchExpenses = createAsyncThunk(
  `${EXPENSES_SLICE_NAME}/fetchAll`,
  async (
    { ago = 'allTime', page = 1, limit = 6, sort = 'uuid', order = 'asc' },
    { rejectWithValue }
  ) => {
    try {
      const params = { ago, page, limit, sort, order };
      const { data, totalCount } = await getAllExpenses(params);
      return { data, totalCount };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchExpenseByUuid = createAsyncThunk(
  `${EXPENSES_SLICE_NAME}/fetchByUuid`,
  async (uuid, { rejectWithValue }) => {
    try {
      const data = await getExpenseByUuid(uuid);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addExpense = createAsyncThunk(
  `${EXPENSES_SLICE_NAME}/add`,
  async (
    { product, quantity, unitPrice, establishment, measure, currency, date },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await createExpense(
        product,
        quantity,
        unitPrice,
        establishment,
        measure,
        currency,
        date
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editExpense = createAsyncThunk(
  `${EXPENSES_SLICE_NAME}/edit`,
  async (
    {
      uuid,
      product,
      quantity,
      unitPrice,
      establishment,
      measure,
      currency,
      date,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await updateExpense(
        uuid,
        product,
        quantity,
        unitPrice,
        establishment,
        measure,
        currency,
        date
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeExpense = createAsyncThunk(
  `${EXPENSES_SLICE_NAME}/remove`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      await deleteExpense(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
