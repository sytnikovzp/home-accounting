import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const emailApi = createApi({
  reducerPath: 'emailApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    resendVerifyEmail: builder.mutation({
      query: (email) => ({
        url: '/email/resend-verify',
        method: 'POST',
        body: { email },
      }),
    }),
  }),
});

export const { useResendVerifyEmailMutation } = emailApi;
