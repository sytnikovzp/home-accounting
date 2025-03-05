import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const currenciesApi = createApi({
  reducerPath: 'currenciesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Currency'],
  endpoints: (builder) => ({
    fetchAllCurrencies: builder.query({
      query: ({ page = 1, limit = 6, sort = 'uuid', order = 'asc' }) => ({
        url: '/currencies',
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
              type: 'Currency',
              id: uuid,
            })),
            { type: 'Currency', id: 'LIST' },
          ];
        }
        return [{ type: 'Currency', id: 'LIST' }];
      },
    }),

    fetchCurrencyByUuid: builder.query({
      query: (currencyUuid) => ({
        url: `/currencies/${currencyUuid}`,
        method: 'GET',
      }),
      providesTags: (response, error, currencyUuid) => [
        { type: 'Currency', id: currencyUuid },
      ],
    }),

    addCurrency: builder.mutation({
      query: ({ title, code }) => ({
        url: '/currencies',
        method: 'POST',
        body: { title, code },
      }),
      invalidatesTags: [{ type: 'Currency', id: 'LIST' }],
    }),

    editCurrency: builder.mutation({
      query: ({ currencyUuid, title, code }) => ({
        url: `/currencies/${currencyUuid}`,
        method: 'PATCH',
        body: { title, code },
      }),
      invalidatesTags: (response, error, { currencyUuid }) => [
        { type: 'Currency', id: currencyUuid },
      ],
    }),

    removeCurrency: builder.mutation({
      query: (currencyUuid) => ({
        url: `/currencies/${currencyUuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Currency', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchAllCurrenciesQuery,
  useFetchCurrencyByUuidQuery,
  useAddCurrencyMutation,
  useEditCurrencyMutation,
  useRemoveCurrencyMutation,
} = currenciesApi;
