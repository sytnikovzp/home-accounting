import { createSlice } from '@reduxjs/toolkit';

import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchCategoryByUuid,
  updateCategory,
} from '../thunks/categoriesThunks';

const initialState = {
  list: [],
  current: null,
  totalCount: 0,
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetState(state) {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchCategories.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Category By UUID
      .addCase(fetchCategoryByUuid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryByUuid.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.current = payload;
      })
      .addCase(fetchCategoryByUuid.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Create Category
      .addCase(createCategory.fulfilled, (state, { payload }) => {
        state.list.push(payload);
      })
      .addCase(createCategory.rejected, (state, { payload }) => {
        state.error = payload;
      })

      // Update Category
      .addCase(updateCategory.fulfilled, (state, { payload }) => {
        const index = state.list.findIndex(
          (category) => category.uuid === payload.uuid
        );
        if (index !== -1) {
          state.list[index] = payload;
        }
      })
      .addCase(updateCategory.rejected, (state, { payload }) => {
        state.error = payload;
      })

      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((category) => category.uuid !== payload);
      })
      .addCase(deleteCategory.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const { resetState } = categoriesSlice.actions;
export default categoriesSlice.reducer;
