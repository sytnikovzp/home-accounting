import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    fetchAllUsers: builder.query({
      query: ({
        emailConfirm = 'all',
        page = 1,
        limit = 6,
        sort = 'uuid',
        order = 'asc',
      }) => ({
        url: '/users',
        method: 'GET',
        params: { emailConfirm, page, limit, sort, order },
      }),
      transformResponse: (response, meta) => ({
        data: response,
        totalCount: parseInt(meta.response?.headers?.get('x-total-count')) || 0,
      }),
      providesTags: (response) => {
        if (response?.data) {
          return [
            ...response.data.map(({ uuid }) => ({
              type: 'User',
              id: uuid,
            })),
            { type: 'User', id: 'LIST' },
          ];
        }
        return [{ type: 'User', id: 'LIST' }];
      },
    }),

    fetchUserByUuid: builder.query({
      query: (userUuid) => ({
        url: `/users/${userUuid}`,
        method: 'GET',
      }),
      providesTags: (response, error, userUuid) => [
        { type: 'User', id: userUuid },
      ],
    }),

    changeUserPassword: builder.mutation({
      query: ({ userUuid, newPassword, confirmNewPassword }) => ({
        url: `/users/${userUuid}/password`,
        method: 'PATCH',
        body: { newPassword, confirmNewPassword },
      }),
    }),

    editUser: builder.mutation({
      query: ({ userUuid, fullName, email, role }) => ({
        url: `/users/${userUuid}`,
        method: 'PATCH',
        body: { fullName, email, role },
      }),
      invalidatesTags: (response, error, { userUuid }) => [
        { type: 'User', id: userUuid },
      ],
    }),

    changeUserPhoto: builder.mutation({
      query: ({ userUuid, userPhoto }) => {
        const formData = new FormData();
        formData.append('userPhoto', userPhoto);
        return {
          url: `/users/${userUuid}/photo`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (response, error, { userUuid }) => [
        { type: 'User', id: userUuid },
      ],
    }),

    resetUserPhoto: builder.mutation({
      query: (userUuid) => ({
        url: `/users/${userUuid}/photo`,
        method: 'DELETE',
      }),
      invalidatesTags: (response, error, { userUuid }) => [
        { type: 'User', id: userUuid },
      ],
    }),

    removeUser: builder.mutation({
      query: (userUuid) => ({
        url: `/users/${userUuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchAllUsersQuery,
  useFetchUserByUuidQuery,
  useChangeUserPasswordMutation,
  useEditUserMutation,
  useChangeUserPhotoMutation,
  useResetUserPhotoMutation,
  useRemoveUserMutation,
} = usersApi;
