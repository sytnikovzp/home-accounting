import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import { fetchPermissions } from '../thunks/permissionsThunks';

const { PERMISSIONS_SLICE_NAME } = sliceNames;

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const permissionsSlice = createSlice({
  name: PERMISSIONS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchPermissions.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.roles = payload.data;
      })

      // Pending
      .addCase(fetchPermissions.pending, setLoadingState)

      // Rejected
      .addCase(fetchPermissions.rejected, setErrorState);
  },
});

export default permissionsSlice.reducer;
