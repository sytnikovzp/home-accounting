import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import { fetchNBURates } from '../thunks/nbuExchangesThunks';

const { NBU_EXCHANGES_SLICE_NAME } = sliceNames;

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const currenciesSlice = createSlice({
  name: NBU_EXCHANGES_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchNBURates.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload;
      })

      // Pending
      .addCase(fetchNBURates.pending, setLoadingState)

      // Rejected
      .addCase(fetchNBURates.rejected, setErrorState);
  },
});

export default currenciesSlice.reducer;
