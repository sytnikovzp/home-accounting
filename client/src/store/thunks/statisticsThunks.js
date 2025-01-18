import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  getCostByCategories,
  getCostByEstablishments,
  getCostByProducts,
} from '../../services/statisticsService';

const { STATISTICS_SLICE_NAME } = sliceNames;

export const fetchStatisticsByCriteria = createAsyncThunk(
  `${STATISTICS_SLICE_NAME}/fetch`,
  async ({ ago, criteria, creatorUuid }, { rejectWithValue }) => {
    try {
      const serviceMap = {
        byCategories: getCostByCategories,
        byEstablishments: getCostByEstablishments,
        byProducts: getCostByProducts,
      };
      const service = serviceMap[criteria];
      if (!service) {
        throw new Error(`Unknown criteria: ${criteria}`);
      }
      const { data } = await service({ ago, creatorUuid });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
