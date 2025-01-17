import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { getNBURates } from '../../services/nbuExchangesService';

const { NBU_EXCHANGES_SLICE_NAME } = sliceNames;

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
