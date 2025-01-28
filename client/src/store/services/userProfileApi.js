import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const userProfileApi = createApi({
  reducerPath: 'userProfileApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['UserProfile'],
  endpoints: (builder) => ({
    fetchProfile: builder.query({
      query: () => ({
        url: 'profile',
        method: 'GET',
      }),
      providesTags: [{ type: 'UserProfile', id: 'PROFILE' }],
    }),

    changePassword: builder.mutation({
      query: ({ newPassword, confirmNewPassword }) => ({
        url: 'profile/password',
        method: 'PATCH',
        body: { newPassword, confirmNewPassword },
      }),
    }),

    editProfile: builder.mutation({
      query: ({ fullName, email, role }) => ({
        url: 'profile',
        method: 'PATCH',
        body: { fullName, email, role },
      }),
      invalidatesTags: [{ type: 'UserProfile', id: 'PROFILE' }],
    }),

    editProfilePhoto: builder.mutation({
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

    resetProfilePhoto: builder.mutation({
      query: () => ({
        url: 'profile/photo/reset',
        method: 'PATCH',
        body: { photo: null },
      }),
      invalidatesTags: [{ type: 'UserProfile', id: 'PROFILE' }],
    }),

    removeProfile: builder.mutation({
      query: () => ({
        url: 'profile',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchProfileQuery,
  useChangePasswordMutation,
  useEditProfileMutation,
  useEditProfilePhotoMutation,
  useResetProfilePhotoMutation,
  useRemoveProfileMutation,
} = userProfileApi;
