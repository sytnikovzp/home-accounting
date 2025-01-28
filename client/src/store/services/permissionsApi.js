import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const permissionsApi = createApi({
  reducerPath: 'permissionsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    fetchAllPermissions: builder.query({
      query: () => ({
        url: '/permissions',
        method: 'GET',
      }),
    }),
  }),
});

export const { useFetchAllPermissionsQuery } = permissionsApi;
