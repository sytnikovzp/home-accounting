import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import {
  addProduct,
  editProduct,
  fetchProductByUuid,
  fetchProducts,
  removeProduct,
} from '../thunks/productsThunks';

const { PRODUCTS_SLICE_NAME } = sliceNames;

const initialState = {
  data: [],
  totalCount: 0,
  current: null,
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: PRODUCTS_SLICE_NAME,
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchProductByUuid.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })
      .addCase(addProduct.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data.push(payload);
      })
      .addCase(editProduct.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const index = state.data.findIndex(
          (product) => product.uuid === payload.uuid
        );
        if (index !== -1) {
          state.data[index] = payload;
        }
      })
      .addCase(removeProduct.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = state.data.filter((product) => product.uuid !== payload);
      })

      // Pending
      .addCase(fetchProducts.pending, setLoadingState)
      .addCase(fetchProductByUuid.pending, setLoadingState)
      .addCase(addProduct.pending, setLoadingState)
      .addCase(editProduct.pending, setLoadingState)
      .addCase(removeProduct.pending, setLoadingState)

      // Rejected
      .addCase(fetchProducts.rejected, setErrorState)
      .addCase(fetchProductByUuid.rejected, setErrorState)
      .addCase(addProduct.rejected, setErrorState)
      .addCase(editProduct.rejected, setErrorState)
      .addCase(removeProduct.rejected, setErrorState);
  },
});

export const { clearCurrent } = productsSlice.actions;

export default productsSlice.reducer;
