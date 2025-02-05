import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

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

    changePassword: builder.mutation({
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
      providesTags: ['UserProfile'],
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
      providesTags: ['UserProfile'],
    }),

    resetUserProfilePhoto: builder.mutation({
      query: () => ({
        url: '/profile/photo',
        method: 'DELETE',
      }),
      providesTags: ['UserProfile'],
    }),

    removeUserProfile: builder.mutation({
      query: () => ({
        url: '/profile',
        method: 'DELETE',
      }),
      providesTags: ['UserProfile'],
    }),
  }),
});

export const {
  useFetchUserProfileQuery,
  useChangePasswordMutation,
  useEditUserProfileMutation,
  useChangeUserProfilePhotoMutation,
  useResetUserProfilePhotoMutation,
  useRemoveUserProfileMutation,
} = userProfileApi;
