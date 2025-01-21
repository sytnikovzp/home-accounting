import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import {
  changePhoto,
  changeUserPassword,
  editUser,
  fetchUserProfile,
  removeUser,
  resetPhoto,
} from '../thunks/userProfileThunks';

const { USER_PROFILE_SLICE_NAME } = sliceNames;

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

const userProfileSlice = createSlice({
  name: USER_PROFILE_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload;
      })
      .addCase(changePhoto.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = {
          ...state.data,
          photo: payload.photo,
        };
      })
      .addCase(resetPhoto.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.data = {
          ...state.data,
          photo: null,
        };
      })
      .addCase(removeUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.data = null;
      })

      // Pending
      .addCase(fetchUserProfile.pending, setLoadingState)
      .addCase(changeUserPassword.pending, setLoadingState)
      .addCase(editUser.pending, setLoadingState)
      .addCase(changePhoto.pending, setLoadingState)
      .addCase(resetPhoto.pending, setLoadingState)
      .addCase(removeUser.pending, setLoadingState)

      // Rejected
      .addCase(fetchUserProfile.rejected, setErrorState)
      .addCase(changeUserPassword.rejected, setErrorState)
      .addCase(editUser.rejected, setErrorState)
      .addCase(changePhoto.rejected, setErrorState)
      .addCase(resetPhoto.rejected, setErrorState)
      .addCase(removeUser.rejected, setErrorState);
  },
});

export default userProfileSlice.reducer;
