import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import {
  addCurrency,
  editCurrency,
  fetchCurrencies,
  fetchCurrencyByUuid,
  removeCurrency,
} from '../thunks/currenciesThunks';

const { CURRENCIES_SLICE_NAME } = sliceNames;

const initialState = {
  data: [],
  totalCount: 0,
  current: null,
  isLoading: false,
  error: null,
};

const currenciesSlice = createSlice({
  name: CURRENCIES_SLICE_NAME,
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchCurrencies.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchCurrencyByUuid.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })
      .addCase(addCurrency.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data.push(payload);
      })
      .addCase(editCurrency.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const index = state.data.findIndex(
          (currency) => currency.uuid === payload.uuid
        );
        if (index !== -1) {
          state.data[index] = payload;
        }
      })
      .addCase(removeCurrency.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = state.data.filter((currency) => currency.uuid !== payload);
      })

      // Pending
      .addCase(fetchCurrencies.pending, setLoadingState)
      .addCase(fetchCurrencyByUuid.pending, setLoadingState)
      .addCase(addCurrency.pending, setLoadingState)
      .addCase(editCurrency.pending, setLoadingState)
      .addCase(removeCurrency.pending, setLoadingState)

      // Rejected
      .addCase(fetchCurrencies.rejected, setErrorState)
      .addCase(fetchCurrencyByUuid.rejected, setErrorState)
      .addCase(addCurrency.rejected, setErrorState)
      .addCase(editCurrency.rejected, setErrorState)
      .addCase(removeCurrency.rejected, setErrorState);
  },
});

export const { clearCurrent } = currenciesSlice.actions;

export default currenciesSlice.reducer;
