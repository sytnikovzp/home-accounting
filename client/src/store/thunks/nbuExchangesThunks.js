import { createAsyncThunk } from '@reduxjs/toolkit';

import { NBU_EXCHANGES_SLICE_NAME } from '../../constants';
import { getNBURates } from '../../services/nbuExchangesService';

export const fetchNBURates = createAsyncThunk(
  `${NBU_EXCHANGES_SLICE_NAME}/fetch`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await getNBURates();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
