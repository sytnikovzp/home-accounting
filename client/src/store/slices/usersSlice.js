import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import {
  changeUserPassword,
  editPhoto,
  editUser,
  fetchUserByUuid,
  fetchUsers,
  removeUser,
  resetPhoto,
} from '../thunks/usersThunks';

const { USERS_SLICE_NAME } = sliceNames;

const initialState = {
  data: [],
  totalCount: 0,
  current: null,
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: USERS_SLICE_NAME,
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchUserByUuid.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })
      .addCase(editUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const index = state.data.findIndex(
          (user) => user.uuid === payload.uuid
        );
        if (index !== -1) {
          state.data[index] = payload;
        }
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editPhoto.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (state.current && state.current.uuid === payload.uuid) {
          state.current.photo = payload.photo;
        }
      })
      .addCase(resetPhoto.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (state.current && state.current.uuid === payload.uuid) {
          state.current.photo = null;
        }
      })
      .addCase(removeUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = state.data.filter((user) => user.uuid !== payload);
      })

      // Pending
      .addCase(fetchUsers.pending, setLoadingState)
      .addCase(fetchUserByUuid.pending, setLoadingState)
      .addCase(editUser.pending, setLoadingState)
      .addCase(changeUserPassword.pending, setLoadingState)
      .addCase(editPhoto.pending, setLoadingState)
      .addCase(resetPhoto.pending, setLoadingState)
      .addCase(removeUser.pending, setLoadingState)

      // Rejected states
      .addCase(fetchUsers.rejected, setErrorState)
      .addCase(fetchUserByUuid.rejected, setErrorState)
      .addCase(editUser.rejected, setErrorState)
      .addCase(changeUserPassword.rejected, setErrorState)
      .addCase(editPhoto.rejected, setErrorState)
      .addCase(resetPhoto.rejected, setErrorState)
      .addCase(removeUser.rejected, setErrorState);
  },
});

export const { clearCurrent } = usersSlice.actions;

export default usersSlice.reducer;
