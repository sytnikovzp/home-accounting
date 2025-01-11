import { createSlice } from '@reduxjs/toolkit';

import { CATEGORIES_SLICE_NAME } from '../../constants';

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
    resetState(state) {
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
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryByUuid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // Rejected
      .addCase(fetchCategories.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(fetchCategoryByUuid.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(createCategory.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(editCategory.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(deleteCategory.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { resetState } = categoriesSlice.actions;

export default categoriesSlice.reducer;
