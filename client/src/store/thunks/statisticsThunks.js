import { createAsyncThunk } from '@reduxjs/toolkit';

import { STATISTICS_SLICE_NAME } from '../../constants';
import statisticsService from '../../services/statisticService';

export const fetchStatisticsByCriteria = createAsyncThunk(
  `${STATISTICS_SLICE_NAME}/fetch`,
  async ({ ago, criteria, creatorUuid }, { rejectWithValue }) => {
    try {
      const serviceMap = {
        byCategories: statisticsService.getCostByCategories,
        byEstablishments: statisticsService.getCostByEstablishments,
        byProducts: statisticsService.getCostByProducts,
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
