import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import { sendVerificationEmail } from '../thunks/emailVerificationThunks';

const { EMAIL_VERIFICATION_SLICE_NAME } = sliceNames;

const initialState = {
  status: null,
  isLoading: false,
  error: null,
};

const emailVerificationSlice = createSlice({
  name: EMAIL_VERIFICATION_SLICE_NAME,
  initialState,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(sendVerificationEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.status = action.payload.severity;
      })

      // Pending
      .addCase(sendVerificationEmail.pending, setLoadingState)

      // Rejected
      .addCase(sendVerificationEmail.rejected, setErrorState);
  },
});

export const { clearStatus } = emailVerificationSlice.actions;

export default emailVerificationSlice.reducer;
