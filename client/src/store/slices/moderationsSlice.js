import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import {
  fetchModerations,
  moderateCategory,
  moderateEstablishment,
  moderateProduct,
} from '../thunks/moderationsThunks';

const { MODERATIONS_SLICE_NAME } = sliceNames;

const initialState = {
  data: [],
  totalCount: 0,
  current: null,
  isLoading: false,
  error: null,
};

const moderationSlice = createSlice({
  name: MODERATIONS_SLICE_NAME,
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchModerations.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(moderateCategory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })
      .addCase(moderateEstablishment.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })
      .addCase(moderateProduct.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })

      // Pending
      .addCase(fetchModerations.pending, setLoadingState)
      .addCase(moderateCategory.pending, setLoadingState)
      .addCase(moderateEstablishment.pending, setLoadingState)
      .addCase(moderateProduct.pending, setLoadingState)

      // Rejected
      .addCase(fetchModerations.rejected, setErrorState)
      .addCase(moderateCategory.rejected, setErrorState)
      .addCase(moderateEstablishment.rejected, setErrorState)
      .addCase(moderateProduct.rejected, setErrorState);
  },
});

export const { clearCurrent } = moderationSlice.actions;

export default moderationSlice.reducer;
