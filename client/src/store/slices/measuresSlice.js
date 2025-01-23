import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  setErrorActionState,
  setErrorListState,
  setLoadingActionState,
  setLoadingListState,
} from '../../utils/sharedFunctions';

import {
  addMeasure,
  editMeasure,
  fetchMeasureByUuid,
  fetchMeasures,
  removeMeasure,
} from '../thunks/measuresThunks';

const { MEASURES_SLICE_NAME } = sliceNames;

const initialState = {
  list: [],
  totalCount: 0,
  isLoadingList: false,
  listLoadingError: null,
  selected: null,
  isProcessingAction: true,
  actionError: null,
};

const measuresSlice = createSlice({
  name: MEASURES_SLICE_NAME,
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchMeasures.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.listLoadingError = null;
        state.list = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchMeasureByUuid.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.selected = payload;
      })
      .addCase(addMeasure.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list.push(payload);
      })
      .addCase(editMeasure.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        const index = state.list.findIndex(
          (measure) => measure.uuid === payload.uuid
        );
        if (index !== -1) {
          state.list[index] = payload;
        }
      })
      .addCase(removeMeasure.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list = state.list.filter((measure) => measure.uuid !== payload);
      })

      // Pending
      .addCase(fetchMeasures.pending, setLoadingListState)
      .addCase(fetchMeasureByUuid.pending, setLoadingActionState)
      .addCase(addMeasure.pending, setLoadingActionState)
      .addCase(editMeasure.pending, setLoadingActionState)
      .addCase(removeMeasure.pending, setLoadingActionState)

      // Rejected
      .addCase(fetchMeasures.rejected, setErrorListState)
      .addCase(fetchMeasureByUuid.rejected, setErrorActionState)
      .addCase(addMeasure.rejected, setErrorActionState)
      .addCase(editMeasure.rejected, setErrorActionState)
      .addCase(removeMeasure.rejected, setErrorActionState);
  },
});

export const { clearSelected } = measuresSlice.actions;

export default measuresSlice.reducer;
