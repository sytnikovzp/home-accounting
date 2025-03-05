import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    fetchAllCategories: builder.query({
      query: ({
        status = 'approved',
        page = 1,
        limit = 6,
        sort = 'uuid',
        order = 'asc',
      }) => ({
        url: '/categories',
        method: 'GET',
        params: { status, page, limit, sort, order },
      }),
      transformResponse: (response, meta) => ({
        data: response,
        totalCount: parseInt(meta.response.headers.get('x-total-count')) || 0,
      }),
      providesTags: (response) => {
        if (response?.data) {
          return [
            ...response.data.map(({ uuid }) => ({
              type: 'Category',
              id: uuid,
            })),
            { type: 'Category', id: 'LIST' },
          ];
        }
        return [{ type: 'Category', id: 'LIST' }];
      },
    }),

    fetchCategoryByUuid: builder.query({
      query: (categoryUuid) => ({
        url: `/categories/${categoryUuid}`,
        method: 'GET',
      }),
      providesTags: (response, error, categoryUuid) => [
        { type: 'Category', id: categoryUuid },
      ],
    }),

    addCategory: builder.mutation({
      query: ({ title }) => ({
        url: '/categories',
        method: 'POST',
        body: { title },
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    editCategory: builder.mutation({
      query: ({ categoryUuid, title }) => ({
        url: `/categories/${categoryUuid}`,
        method: 'PATCH',
        body: { title },
      }),
      invalidatesTags: (response, error, { categoryUuid }) => [
        { type: 'Category', id: categoryUuid },
      ],
    }),

    removeCategory: builder.mutation({
      query: (categoryUuid) => ({
        url: `/categories/${categoryUuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchAllCategoriesQuery,
  useFetchCategoryByUuidQuery,
  useAddCategoryMutation,
  useEditCategoryMutation,
  useRemoveCategoryMutation,
} = categoriesApi;
