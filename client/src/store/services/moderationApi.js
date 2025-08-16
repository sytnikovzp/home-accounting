import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '@/src/store/services/apiSlice';

export const moderationApi = createApi({
  reducerPath: 'moderationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Moderation'],
  endpoints: (builder) => ({
    fetchAllPendingItems: builder.query({
      query: ({ page = 1, limit = 6, sort = 'uuid', order = 'asc' }) => ({
        url: '/moderation',
        method: 'GET',
        params: { page, limit, sort, order },
      }),
      transformResponse: (response, meta) => ({
        data: response,
        totalCount: parseInt(meta.response?.headers?.get('x-total-count')) || 0,
      }),
      providesTags: (response) => {
        if (response?.data) {
          return [
            ...response.data.map(({ uuid }) => ({
              type: 'Moderation',
              id: uuid,
            })),
            { type: 'Moderation', id: 'LIST' },
          ];
        }
        return [{ type: 'Moderation', id: 'LIST' }];
      },
    }),

    moderationCategory: builder.mutation({
      query: ({ categoryUuid, status }) => ({
        url: `/moderation/categories/${categoryUuid}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (response, error, { categoryUuid }) => [
        { type: 'Moderation', id: categoryUuid },
      ],
    }),

    moderationProduct: builder.mutation({
      query: ({ productUuid, status }) => ({
        url: `/moderation/products/${productUuid}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (response, error, { productUuid }) => [
        { type: 'Moderation', id: productUuid },
      ],
    }),

    moderationEstablishment: builder.mutation({
      query: ({ establishmentUuid, status }) => ({
        url: `/moderation/establishments/${establishmentUuid}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (response, error, { establishmentUuid }) => [
        { type: 'Moderation', id: establishmentUuid },
      ],
    }),
  }),
});

export const {
  useFetchAllPendingItemsQuery,
  useModerationCategoryMutation,
  useModerationProductMutation,
  useModerationEstablishmentMutation,
} = moderationApi;
