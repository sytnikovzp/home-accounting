import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  createMeasure,
  deleteMeasure,
  getAllMeasures,
  getMeasureByUuid,
  updateMeasure,
} from '../../services/measuresService';

const { MEASURES_SLICE_NAME } = sliceNames;

export const fetchMeasures = createAsyncThunk(
  `${MEASURES_SLICE_NAME}/fetchAll`,
  async (
    { page = 1, limit = 6, sort = 'uuid', order = 'asc' },
    { rejectWithValue }
  ) => {
    try {
      const params = { page, limit, sort, order };
      const { data, totalCount } = await getAllMeasures(params);
      return { data, totalCount };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMeasureByUuid = createAsyncThunk(
  `${MEASURES_SLICE_NAME}/fetchByUuid`,
  async (uuid, { rejectWithValue }) => {
    try {
      const data = await getMeasureByUuid(uuid);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addMeasure = createAsyncThunk(
  `${MEASURES_SLICE_NAME}/add`,
  async ({ title, description }, { rejectWithValue }) => {
    try {
      const { data } = await createMeasure(title, description);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editMeasure = createAsyncThunk(
  `${MEASURES_SLICE_NAME}/edit`,
  async ({ uuid, title, description }, { rejectWithValue }) => {
    try {
      const { data } = await updateMeasure(uuid, title, description);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeMeasure = createAsyncThunk(
  `${MEASURES_SLICE_NAME}/remove`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      await deleteMeasure(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
