import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import {
  addRole,
  editRole,
  fetchRoleByUuid,
  fetchRoles,
  removeRole,
} from '../thunks/rolesThunks';

const { ROLES_SLICE_NAME } = sliceNames;

const initialState = {
  data: [],
  totalCount: 0,
  current: null,
  isLoading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: ROLES_SLICE_NAME,
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchRoles.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchRoleByUuid.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })
      .addCase(addRole.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data.push(payload);
      })
      .addCase(editRole.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const index = state.data.findIndex(
          (role) => role.uuid === payload.uuid
        );
        if (index !== -1) {
          state.data[index] = payload;
        }
      })
      .addCase(removeRole.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = state.data.filter((role) => role.uuid !== payload);
      })

      // Pending
      .addCase(fetchRoles.pending, setLoadingState)
      .addCase(fetchRoleByUuid.pending, setLoadingState)
      .addCase(addRole.pending, setLoadingState)
      .addCase(editRole.pending, setLoadingState)
      .addCase(removeRole.pending, setLoadingState)

      // Rejected
      .addCase(fetchRoles.rejected, setErrorState)
      .addCase(fetchRoleByUuid.rejected, setErrorState)
      .addCase(addRole.rejected, setErrorState)
      .addCase(editRole.rejected, setErrorState)
      .addCase(removeRole.rejected, setErrorState);
  },
});

export const { clearCurrent } = rolesSlice.actions;

export default rolesSlice.reducer;
