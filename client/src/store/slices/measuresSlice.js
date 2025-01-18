import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import {
  addMeasure,
  editMeasure,
  fetchMeasureByUuid,
  fetchMeasures,
  removeMeasure,
} from '../thunks/measuresThunks';

const { MEASURES_SLICE_NAME } = sliceNames;

const initialState = {
  data: [],
  totalCount: 0,
  current: null,
  isLoading: false,
  error: null,
};

const measuresSlice = createSlice({
  name: MEASURES_SLICE_NAME,
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchMeasures.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchMeasureByUuid.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })
      .addCase(addMeasure.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data.push(payload);
      })
      .addCase(editMeasure.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const index = state.data.findIndex(
          (measure) => measure.uuid === payload.uuid
        );
        if (index !== -1) {
          state.data[index] = payload;
        }
      })
      .addCase(removeMeasure.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = state.data.filter((measure) => measure.uuid !== payload);
      })

      // Pending
      .addCase(fetchMeasures.pending, setLoadingState)
      .addCase(fetchMeasureByUuid.pending, setLoadingState)
      .addCase(addMeasure.pending, setLoadingState)
      .addCase(editMeasure.pending, setLoadingState)
      .addCase(removeMeasure.pending, setLoadingState)

      // Rejected
      .addCase(fetchMeasures.rejected, setErrorState)
      .addCase(fetchMeasureByUuid.rejected, setErrorState)
      .addCase(addMeasure.rejected, setErrorState)
      .addCase(editMeasure.rejected, setErrorState)
      .addCase(removeMeasure.rejected, setErrorState);
  },
});

export const { clearCurrent } = measuresSlice.actions;

export default measuresSlice.reducer;
