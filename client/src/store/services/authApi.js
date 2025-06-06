import { createApi } from '@reduxjs/toolkit/query/react';

import { removeAccessToken, saveAccessToken } from '../../utils/authHelpers';

import { clearAuthenticationState } from '../slices/authenticationSlice';

import { baseQueryWithReauth } from './apiSlice';
import { userProfileApi } from './userProfileApi';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    registration: builder.mutation({
      query: ({ fullName, email, password }) => ({
        url: '/auth/registration',
        method: 'POST',
        body: { fullName, email, password },
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          saveAccessToken(data.accessToken);
          dispatch(userProfileApi.util.invalidateTags(['UserProfile']));
        } catch (error) {
          console.warn('Registration failed: ', error.error?.data?.message);
        }
      },
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password },
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          saveAccessToken(data.accessToken);
          dispatch(userProfileApi.util.invalidateTags(['UserProfile']));
        } catch (error) {
          console.warn('Login failed: ', error.error?.data?.message);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          removeAccessToken();
          dispatch(userProfileApi.util.resetApiState());
          dispatch(authApi.util.resetApiState());
          dispatch(clearAuthenticationState());
        } catch (error) {
          console.warn('Logout failed: ', error.error?.data?.message);
        }
      },
    }),

    refreshAccessToken: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
      }),
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          saveAccessToken(data.accessToken);
        } catch (error) {
          console.warn('Token refresh failed: ', error.error?.data?.message);
        }
      },
    }),

    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: '/auth/forgot',
        method: 'POST',
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, newPassword, confirmNewPassword }) => ({
        url: `/auth/reset?token=${token}`,
        method: 'POST',
        body: { newPassword, confirmNewPassword },
      }),
    }),
  }),
});

export const {
  useRegistrationMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshAccessTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
