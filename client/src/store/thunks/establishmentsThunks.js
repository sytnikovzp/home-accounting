import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  createEstablishment,
  deleteEstablishment,
  deleteEstablishmentLogo,
  getAllEstablishments,
  getEstablishmentByUuid,
  updateEstablishment,
  updateEstablishmentLogo,
} from '../../services/establishmentsService';

const { ESTABLISHMENTS_SLICE_NAME } = sliceNames;

export const fetchEstablishments = createAsyncThunk(
  `${ESTABLISHMENTS_SLICE_NAME}/fetchAll`,
  async (
    { status = 'approved', page = 1, limit = 6, sort = 'uuid', order = 'asc' },
    { rejectWithValue }
  ) => {
    try {
      const params = { status, page, limit, sort, order };
      const { data, totalCount } = await getAllEstablishments(params);
      return { data, totalCount };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEstablishmentByUuid = createAsyncThunk(
  `${ESTABLISHMENTS_SLICE_NAME}/fetchByUuid`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      const { data } = await getEstablishmentByUuid(uuid);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addEstablishment = createAsyncThunk(
  `${ESTABLISHMENTS_SLICE_NAME}/add`,
  async ({ title, description, url }, { rejectWithValue }) => {
    try {
      const { data } = await createEstablishment(title, description, url);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editEstablishment = createAsyncThunk(
  `${ESTABLISHMENTS_SLICE_NAME}/edit`,
  async ({ uuid, title, description, url }, { rejectWithValue }) => {
    try {
      const { data } = await updateEstablishment(uuid, title, description, url);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadEstablishmentLogo = createAsyncThunk(
  `${ESTABLISHMENTS_SLICE_NAME}/uploadLogo`,
  async ({ uuid, logoFile }, { rejectWithValue }) => {
    try {
      const { data } = await updateEstablishmentLogo(uuid, logoFile);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeEstablishmentLogo = createAsyncThunk(
  `${ESTABLISHMENTS_SLICE_NAME}/removeLogo`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      const { data } = await deleteEstablishmentLogo(uuid);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeEstablishment = createAsyncThunk(
  `${ESTABLISHMENTS_SLICE_NAME}/remove`,
  async ({ uuid }, { rejectWithValue }) => {
    try {
      await deleteEstablishment(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
