import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  setErrorActionState,
  setErrorListState,
  setLoadingActionState,
  setLoadingListState,
} from '../../utils/sharedFunctions';

import {
  fetchModerations,
  moderateCategory,
  moderateEstablishment,
  moderateProduct,
} from '../thunks/moderationsThunks';

const { MODERATIONS_SLICE_NAME } = sliceNames;

const initialState = {
  list: [],
  totalCount: 0,
  isLoadingList: false,
  listLoadingError: null,
  selected: null,
  isProcessingAction: true,
  actionError: null,
};

const moderationSlice = createSlice({
  name: MODERATIONS_SLICE_NAME,
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
      .addCase(fetchModerations.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.listLoadingError = null;
        state.list = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(moderateCategory.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.selected = payload;
      })
      .addCase(moderateEstablishment.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.selected = payload;
      })
      .addCase(moderateProduct.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.selected = payload;
      })

      // Pending
      .addCase(fetchModerations.pending, setLoadingListState)
      .addCase(moderateCategory.pending, setLoadingActionState)
      .addCase(moderateEstablishment.pending, setLoadingActionState)
      .addCase(moderateProduct.pending, setLoadingActionState)

      // Rejected
      .addCase(fetchModerations.rejected, setErrorListState)
      .addCase(moderateCategory.rejected, setErrorActionState)
      .addCase(moderateEstablishment.rejected, setErrorActionState)
      .addCase(moderateProduct.rejected, setErrorActionState);
  },
});

export const { clearSelected } = moderationSlice.actions;

export default moderationSlice.reducer;
