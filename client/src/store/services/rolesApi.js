import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Role'],
  endpoints: (builder) => ({
    fetchAllRoles: builder.query({
      query: ({ page = 1, limit = 6, sort = 'uuid', order = 'asc' }) => ({
        url: '/roles',
        method: 'GET',
        params: { page, limit, sort, order },
      }),
      transformResponse: (response, meta) => ({
        data: response,
        totalCount: parseInt(meta.response.headers.get('x-total-count')) || 0,
      }),
      providesTags: (response) => {
        if (response?.data) {
          return [
            ...response.data.map(({ uuid }) => ({
              type: 'Role',
              id: uuid,
            })),
            { type: 'Role', id: 'LIST' },
          ];
        }
        return [{ type: 'Role', id: 'LIST' }];
      },
    }),

    fetchRoleByUuid: builder.query({
      query: (roleUuid) => ({
        url: `/roles/${roleUuid}`,
        method: 'GET',
      }),
      providesTags: (response, error, roleUuid) => [
        { type: 'Role', id: roleUuid },
      ],
    }),

    addRole: builder.mutation({
      query: ({ title, description = '', permissions = [] }) => ({
        url: '/roles',
        method: 'POST',
        body: { title, description, permissions },
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),

    editRole: builder.mutation({
      query: ({ roleUuid, title, description, permissions }) => ({
        url: `/roles/${roleUuid}`,
        method: 'PATCH',
        body: { title, description, permissions },
      }),
      invalidatesTags: (response, error, { roleUuid }) => [
        { type: 'Role', id: roleUuid },
      ],
    }),

    removeRole: builder.mutation({
      query: (roleUuid) => ({
        url: `/roles/${roleUuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchAllRolesQuery,
  useFetchRoleByUuidQuery,
  useAddRoleMutation,
  useEditRoleMutation,
  useRemoveRoleMutation,
} = rolesApi;
