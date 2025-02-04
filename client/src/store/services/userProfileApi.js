import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const userProfileApi = createApi({
  reducerPath: 'userProfileApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['UserProfile'],
  endpoints: (builder) => ({
    fetchUserProfile: builder.query({
      query: () => ({
        url: 'profile',
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
    }),

    changePassword: builder.mutation({
      query: ({ newPassword, confirmNewPassword }) => ({
        url: 'profile/password',
        method: 'PATCH',
        body: { newPassword, confirmNewPassword },
      }),
    }),

    editUserProfile: builder.mutation({
      query: ({ fullName, email, role }) => ({
        url: 'profile',
        method: 'PATCH',
        body: { fullName, email, role },
      }),
      invalidatesTags: [{ type: 'UserProfile', id: 'PROFILE' }],
    }),

    changeUserProfilePhoto: builder.mutation({
      query: ({ userPhoto }) => {
        const formData = new FormData();
        formData.append('userPhoto', userPhoto);
        return {
          url: 'profile/photo',
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'UserProfile', id: 'PROFILE' }],
    }),

    resetUserProfilePhoto: builder.mutation({
      query: () => ({
        url: 'profile/photo',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'UserProfile', id: 'PROFILE' }],
    }),

    removeUserProfile: builder.mutation({
      query: () => ({
        url: 'profile',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'UserProfile', id: 'PROFILE' }],
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
