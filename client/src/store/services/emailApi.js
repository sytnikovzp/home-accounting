import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const emailApi = createApi({
  reducerPath: 'emailApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    resendConfirmEmail: builder.mutation({
      query: (email) => ({
        url: '/email/resend-confirm',
        method: 'POST',
        body: { email },
      }),
    }),
  }),
});

export const { useResendConfirmEmailMutation } = emailApi;
