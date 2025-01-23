import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  setErrorActionState,
  setErrorListState,
  setLoadingActionState,
  setLoadingListState,
} from '../../utils/sharedFunctions';

import {
  addProduct,
  editProduct,
  fetchProductByUuid,
  fetchProducts,
  removeProduct,
} from '../thunks/productsThunks';

const { PRODUCTS_SLICE_NAME } = sliceNames;

const initialState = {
  list: [],
  totalCount: 0,
  isLoadingList: false,
  listLoadingError: null,
  selected: null,
  isProcessingAction: true,
  actionError: null,
};

const productsSlice = createSlice({
  name: PRODUCTS_SLICE_NAME,
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
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.listLoadingError = null;
        state.list = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchProductByUuid.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.selected = payload;
      })
      .addCase(addProduct.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list.push(payload);
      })
      .addCase(editProduct.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        const index = state.list.findIndex(
          (product) => product.uuid === payload.uuid
        );
        if (index !== -1) {
          state.list[index] = payload;
        }
      })
      .addCase(removeProduct.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list = state.list.filter((product) => product.uuid !== payload);
      })

      // Pending
      .addCase(fetchProducts.pending, setLoadingListState)
      .addCase(fetchProductByUuid.pending, setLoadingActionState)
      .addCase(addProduct.pending, setLoadingActionState)
      .addCase(editProduct.pending, setLoadingActionState)
      .addCase(removeProduct.pending, setLoadingActionState)

      // Rejected
      .addCase(fetchProducts.rejected, setErrorListState)
      .addCase(fetchProductByUuid.rejected, setErrorActionState)
      .addCase(addProduct.rejected, setErrorActionState)
      .addCase(editProduct.rejected, setErrorActionState)
      .addCase(removeProduct.rejected, setErrorActionState);
  },
});

export const { clearSelected } = productsSlice.actions;

export default productsSlice.reducer;
