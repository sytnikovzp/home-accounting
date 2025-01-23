import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  setErrorActionState,
  setErrorListState,
  setLoadingActionState,
  setLoadingListState,
} from '../../utils/sharedFunctions';

import {
  addCurrency,
  editCurrency,
  fetchCurrencies,
  fetchCurrencyByUuid,
  removeCurrency,
} from '../thunks/currenciesThunks';

const { CURRENCIES_SLICE_NAME } = sliceNames;

const initialState = {
  list: [],
  totalCount: 0,
  isLoadingList: false,
  listLoadingError: null,
  selected: null,
  isProcessingAction: true,
  actionError: null,
};

const currenciesSlice = createSlice({
  name: CURRENCIES_SLICE_NAME,
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
      .addCase(fetchCurrencies.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.listLoadingError = null;
        state.list = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchCurrencyByUuid.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.selected = payload;
      })
      .addCase(addCurrency.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list.push(payload);
      })
      .addCase(editCurrency.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        const index = state.list.findIndex(
          (currency) => currency.uuid === payload.uuid
        );
        if (index !== -1) {
          state.list[index] = payload;
        }
      })
      .addCase(removeCurrency.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list = state.list.filter((currency) => currency.uuid !== payload);
      })

      // Pending
      .addCase(fetchCurrencies.pending, setLoadingListState)
      .addCase(fetchCurrencyByUuid.pending, setLoadingActionState)
      .addCase(addCurrency.pending, setLoadingActionState)
      .addCase(editCurrency.pending, setLoadingActionState)
      .addCase(removeCurrency.pending, setLoadingActionState)

      // Rejected
      .addCase(fetchCurrencies.rejected, setErrorListState)
      .addCase(fetchCurrencyByUuid.rejected, setErrorActionState)
      .addCase(addCurrency.rejected, setErrorActionState)
      .addCase(editCurrency.rejected, setErrorActionState)
      .addCase(removeCurrency.rejected, setErrorActionState);
  },
});

export const { clearSelected } = currenciesSlice.actions;

export default currenciesSlice.reducer;
