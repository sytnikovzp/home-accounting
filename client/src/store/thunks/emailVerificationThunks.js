import { createAsyncThunk } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { resendVerifyEmail } from '../../services/emailVerificationService';

const { EMAIL_VERIFICATION_SLICE_NAME } = sliceNames;

export const sendVerificationEmail = createAsyncThunk(
  `${EMAIL_VERIFICATION_SLICE_NAME}/resend`,
  async (email, { rejectWithValue }) => {
    try {
      const data = await resendVerifyEmail(email);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
