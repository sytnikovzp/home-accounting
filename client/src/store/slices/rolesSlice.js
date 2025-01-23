import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  setErrorActionState,
  setErrorListState,
  setLoadingActionState,
  setLoadingListState,
} from '../../utils/sharedFunctions';

import {
  addRole,
  editRole,
  fetchRoleByUuid,
  fetchRoles,
  removeRole,
} from '../thunks/rolesThunks';

const { ROLES_SLICE_NAME } = sliceNames;

const initialState = {
  list: [],
  totalCount: 0,
  isLoadingList: false,
  listLoadingError: null,
  selected: null,
  isProcessingAction: true,
  actionError: null,
};

const rolesSlice = createSlice({
  name: ROLES_SLICE_NAME,
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
      .addCase(fetchRoles.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.listLoadingError = null;
        state.list = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchRoleByUuid.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.selected = payload;
      })
      .addCase(addRole.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list.push(payload);
      })
      .addCase(editRole.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        const index = state.list.findIndex(
          (role) => role.uuid === payload.uuid
        );
        if (index !== -1) {
          state.list[index] = payload;
        }
      })
      .addCase(removeRole.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list = state.list.filter((role) => role.uuid !== payload);
      })

      // Pending
      .addCase(fetchRoles.pending, setLoadingListState)
      .addCase(fetchRoleByUuid.pending, setLoadingActionState)
      .addCase(addRole.pending, setLoadingActionState)
      .addCase(editRole.pending, setLoadingActionState)
      .addCase(removeRole.pending, setLoadingActionState)

      // Rejected
      .addCase(fetchRoles.rejected, setErrorListState)
      .addCase(fetchRoleByUuid.rejected, setErrorActionState)
      .addCase(addRole.rejected, setErrorActionState)
      .addCase(editRole.rejected, setErrorActionState)
      .addCase(removeRole.rejected, setErrorActionState);
  },
});

export const { clearSelected } = rolesSlice.actions;

export default rolesSlice.reducer;
