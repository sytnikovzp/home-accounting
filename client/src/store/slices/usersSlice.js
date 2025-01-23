import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  setErrorActionState,
  setErrorListState,
  setLoadingActionState,
  setLoadingListState,
} from '../../utils/sharedFunctions';

import {
  changePhoto,
  changeUserPassword,
  editUser,
  fetchUserByUuid,
  fetchUsers,
  removeUser,
  resetPhoto,
} from '../thunks/usersThunks';

const { USERS_SLICE_NAME } = sliceNames;

const initialState = {
  list: [],
  totalCount: 0,
  isLoadingList: false,
  listLoadingError: null,
  selected: null,
  isProcessingAction: true,
  actionError: null,
};

const usersSlice = createSlice({
  name: USERS_SLICE_NAME,
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
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.listLoadingError = null;
        state.list = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchUserByUuid.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.selected = payload;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isProcessingAction = false;
        state.actionError = null;
      })
      .addCase(editUser.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        const index = state.list.findIndex(
          (user) => user.uuid === payload.uuid
        );
        if (index !== -1) {
          state.list[index] = payload;
        }
      })
      .addCase(changePhoto.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        if (state.selected && state.selected.uuid === payload.uuid) {
          state.selected.photo = payload.photo;
        }
      })
      .addCase(resetPhoto.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        if (state.selected && state.selected.uuid === payload.uuid) {
          state.selected.photo = null;
        }
      })
      .addCase(removeUser.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list = state.list.filter((user) => user.uuid !== payload);
      })

      // Pending
      .addCase(fetchUsers.pending, setLoadingListState)
      .addCase(fetchUserByUuid.pending, setLoadingActionState)
      .addCase(changeUserPassword.pending, setLoadingActionState)
      .addCase(editUser.pending, setLoadingActionState)
      .addCase(changePhoto.pending, setLoadingActionState)
      .addCase(resetPhoto.pending, setLoadingActionState)
      .addCase(removeUser.pending, setLoadingActionState)

      // Rejected
      .addCase(fetchUsers.rejected, setErrorListState)
      .addCase(fetchUserByUuid.rejected, setErrorActionState)
      .addCase(changeUserPassword.rejected, setErrorActionState)
      .addCase(editUser.rejected, setErrorActionState)
      .addCase(changePhoto.rejected, setErrorActionState)
      .addCase(resetPhoto.rejected, setErrorActionState)
      .addCase(removeUser.rejected, setErrorActionState);
  },
});

export const { clearSelected } = usersSlice.actions;

export default usersSlice.reducer;
