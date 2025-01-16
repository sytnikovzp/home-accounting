import { createAsyncThunk } from '@reduxjs/toolkit';

import { STATISTICS_SLICE_NAME } from '../../constants';
import {
  getCostByCategories,
  getCostByEstablishments,
  getCostByProducts,
} from '../../services/statisticsService';

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
      const response = await service({ ago, creatorUuid });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
