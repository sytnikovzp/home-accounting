import { createSlice } from '@reduxjs/toolkit';

import { CATEGORIES_SLICE_NAME } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import {
  createCategory,
  deleteCategory,
  editCategory,
  fetchCategories,
  fetchCategoryByUuid,
} from '../thunks/categoriesThunks';

const initialState = {
  list: [],
  current: null,
  totalCount: 0,
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
        state.list = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchCategoryByUuid.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })
      .addCase(createCategory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.list.push(payload);
      })
      .addCase(editCategory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const index = state.list.findIndex(
          (category) => category.uuid === payload.uuid
        );
        if (index !== -1) {
          state.list[index] = payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.list = state.list.filter((category) => category.uuid !== payload);
      })

      // Pending
      .addCase(fetchCategories.pending, setLoadingState)
      .addCase(fetchCategoryByUuid.pending, setLoadingState)
      .addCase(createCategory.pending, setLoadingState)
      .addCase(editCategory.pending, setLoadingState)
      .addCase(deleteCategory.pending, setLoadingState)

      // Rejected
      .addCase(fetchCategories.rejected, setErrorState)
      .addCase(fetchCategoryByUuid.rejected, setErrorState)
      .addCase(createCategory.rejected, setErrorState)
      .addCase(editCategory.rejected, setErrorState)
      .addCase(deleteCategory.rejected, setErrorState);
  },
});

export const { clearCurrent } = categoriesSlice.actions;

export default categoriesSlice.reducer;
