import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import {
  addCategory,
  editCategory,
  fetchCategories,
  fetchCategoryByUuid,
  removeCategory,
} from '../thunks/categoriesThunks';

const { CATEGORIES_SLICE_NAME } = sliceNames;

const initialState = {
  data: [],
  totalCount: 0,
  current: null,
  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: CATEGORIES_SLICE_NAME,
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchCategoryByUuid.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })
      .addCase(addCategory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data.push(payload);
      })
      .addCase(editCategory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const index = state.data.findIndex(
          (category) => category.uuid === payload.uuid
        );
        if (index !== -1) {
          state.data[index] = payload;
        }
      })
      .addCase(removeCategory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = state.data.filter((category) => category.uuid !== payload);
      })

      // Pending
      .addCase(fetchCategories.pending, setLoadingState)
      .addCase(fetchCategoryByUuid.pending, setLoadingState)
      .addCase(addCategory.pending, setLoadingState)
      .addCase(editCategory.pending, setLoadingState)
      .addCase(removeCategory.pending, setLoadingState)

      // Rejected
      .addCase(fetchCategories.rejected, setErrorState)
      .addCase(fetchCategoryByUuid.rejected, setErrorState)
      .addCase(addCategory.rejected, setErrorState)
      .addCase(editCategory.rejected, setErrorState)
      .addCase(removeCategory.rejected, setErrorState);
  },
});

export const { clearCurrent } = categoriesSlice.actions;

export default categoriesSlice.reducer;
