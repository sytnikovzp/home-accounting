import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '@/src/store/services/apiSlice';

export const userProfileApi = createApi({
  reducerPath: 'userProfileApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['UserProfile'],
  endpoints: (builder) => ({
    fetchUserProfile: builder.query({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
    }),

    resendConfirmEmail: builder.mutation({
      query: () => ({
        url: '/profile/resend',
        method: 'GET',
      }),
    }),

    changeUserProfilePassword: builder.mutation({
      query: ({ newPassword, confirmNewPassword }) => ({
        url: '/profile/password',
        method: 'PATCH',
        body: { newPassword, confirmNewPassword },
      }),
    }),

    editUserProfile: builder.mutation({
      query: ({ fullName, email, role }) => ({
        url: '/profile',
        method: 'PATCH',
        body: { fullName, email, role },
      }),
      invalidatesTags: ['UserProfile'],
    }),

    changeUserProfilePhoto: builder.mutation({
      query: ({ userPhoto }) => {
        const formData = new FormData();
        formData.append('userPhoto', userPhoto);
        return {
          url: '/profile/photo',
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['UserProfile'],
    }),

    resetUserProfilePhoto: builder.mutation({
      query: () => ({
        url: '/profile/photo',
        method: 'DELETE',
      }),
      invalidatesTags: ['UserProfile'],
    }),

    removeUserProfile: builder.mutation({
      query: () => ({
        url: '/profile',
        method: 'DELETE',
      }),
      invalidatesTags: ['UserProfile'],
    }),
  }),
});

export const {
  useFetchUserProfileQuery,
  useResendConfirmEmailMutation,
  useChangeUserProfilePasswordMutation,
  useEditUserProfileMutation,
  useChangeUserProfilePhotoMutation,
  useResetUserProfilePhotoMutation,
  useRemoveUserProfileMutation,
} = userProfileApi;
