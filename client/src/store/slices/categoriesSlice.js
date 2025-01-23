import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  setErrorActionState,
  setErrorListState,
  setLoadingActionState,
  setLoadingListState,
} from '../../utils/sharedFunctions';

import {
  addCategory,
  editCategory,
  fetchCategories,
  fetchCategoryByUuid,
  removeCategory,
} from '../thunks/categoriesThunks';

const { CATEGORIES_SLICE_NAME } = sliceNames;

const initialState = {
  list: [],
  totalCount: 0,
  isLoadingList: false,
  listLoadingError: null,
  selected: null,
  isProcessingAction: true,
  actionError: null,
};

const categoriesSlice = createSlice({
  name: CATEGORIES_SLICE_NAME,
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
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.listLoadingError = null;
        state.list = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchCategoryByUuid.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.selected = payload;
      })
      .addCase(addCategory.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list.push(payload);
      })
      .addCase(editCategory.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        const index = state.list.findIndex(
          (category) => category.uuid === payload.uuid
        );
        if (index !== -1) {
          state.list[index] = payload;
        }
      })
      .addCase(removeCategory.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list = state.list.filter((category) => category.uuid !== payload);
      })

      // Pending
      .addCase(fetchCategories.pending, setLoadingListState)
      .addCase(fetchCategoryByUuid.pending, setLoadingActionState)
      .addCase(addCategory.pending, setLoadingActionState)
      .addCase(editCategory.pending, setLoadingActionState)
      .addCase(removeCategory.pending, setLoadingActionState)

      // Rejected
      .addCase(fetchCategories.rejected, setErrorListState)
      .addCase(fetchCategoryByUuid.rejected, setErrorActionState)
      .addCase(addCategory.rejected, setErrorActionState)
      .addCase(editCategory.rejected, setErrorActionState)
      .addCase(removeCategory.rejected, setErrorActionState);
  },
});

export const { clearSelected } = categoriesSlice.actions;

export default categoriesSlice.reducer;
