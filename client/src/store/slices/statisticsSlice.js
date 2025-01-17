import { createSlice } from '@reduxjs/toolkit';

import { STATISTICS_SLICE_NAME } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import { fetchStatisticsByCriteria } from '../thunks/statisticsThunks';

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const statisticsSlice = createSlice({
  name: STATISTICS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchStatisticsByCriteria.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.data = payload;
      })
      // Pending
      .addCase(fetchStatisticsByCriteria.pending, setLoadingState)
      // Rejected
      .addCase(fetchStatisticsByCriteria.rejected, setErrorState);
  },
});

export default statisticsSlice.reducer;
