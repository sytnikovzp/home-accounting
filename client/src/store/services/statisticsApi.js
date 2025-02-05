import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const statisticsApi = createApi({
  reducerPath: 'statisticsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    fetchCostByCategories: builder.query({
      query: ({ ago = 'allTime', creatorUuid }) => ({
        url: '/statistics/categories',
        method: 'GET',
        params: creatorUuid ? { ago, creatorUuid } : { ago },
      }),
    }),

    fetchCostByEstablishments: builder.query({
      query: ({ ago = 'allTime', creatorUuid }) => ({
        url: '/statistics/establishments',
        method: 'GET',
        params: creatorUuid ? { ago, creatorUuid } : { ago },
      }),
    }),

    fetchCostByProducts: builder.query({
      query: ({ ago = 'allTime', creatorUuid }) => ({
        url: '/statistics/products',
        method: 'GET',
        params: creatorUuid ? { ago, creatorUuid } : { ago },
      }),
    }),
  }),
});

export const {
  useFetchCostByCategoriesQuery,
  useFetchCostByEstablishmentsQuery,
  useFetchCostByProductsQuery,
} = statisticsApi;
