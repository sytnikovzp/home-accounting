import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  setErrorListState,
  setLoadingListState,
} from '../../utils/sharedFunctions';

import { fetchPermissions } from '../thunks/permissionsThunks';

const { PERMISSIONS_SLICE_NAME } = sliceNames;

const initialState = {
  list: [],
  isLoadingList: false,
  listLoadingError: null,
};

const permissionsSlice = createSlice({
  name: PERMISSIONS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchPermissions.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.listLoadingError = null;
        state.list = payload.data;
      })

      // Pending
      .addCase(fetchPermissions.pending, setLoadingListState)

      // Rejected
      .addCase(fetchPermissions.rejected, setErrorListState);
  },
});

export default permissionsSlice.reducer;
