import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const expensesApi = createApi({
  reducerPath: 'expensesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Expense'],
  endpoints: (builder) => ({
    fetchAllExpenses: builder.query({
      query: ({
        ago = 'allTime',
        page = 1,
        limit = 6,
        sort = 'uuid',
        order = 'asc',
      }) => ({
        url: '/expenses',
        method: 'GET',
        params: { ago, page, limit, sort, order },
      }),
      transformResponse: (response, meta) => ({
        data: response,
        totalCount: parseInt(meta.response.headers.get('x-total-count')) || 0,
        totalSum: parseInt(meta.response.headers.get('x-total-sum')) || 0,
      }),
      providesTags: (result) => {
        if (result?.data) {
          return [
            ...result.data.map(({ uuid }) => ({
              type: 'Expense',
              id: uuid,
            })),
            { type: 'Expense', id: 'LIST' },
          ];
        }
        return [{ type: 'Expense', id: 'LIST' }];
      },
    }),

    fetchExpenseByUuid: builder.query({
      query: (expenseUuid) => ({
        url: `/expenses/${expenseUuid}`,
        method: 'GET',
      }),
      providesTags: (result, error, expenseUuid) => [
        { type: 'Expense', id: expenseUuid },
      ],
    }),

    addExpense: builder.mutation({
      query: ({
        product,
        quantity,
        unitPrice,
        establishment,
        measure,
        currency,
        date,
      }) => ({
        url: '/expenses',
        method: 'POST',
        body: {
          product,
          quantity,
          unitPrice,
          establishment,
          measure,
          currency,
          date,
        },
      }),
      invalidatesTags: [{ type: 'Expense', id: 'LIST' }],
    }),

    editExpense: builder.mutation({
      query: ({
        expenseUuid,
        product,
        quantity,
        unitPrice,
        establishment,
        measure,
        currency,
        date,
      }) => ({
        url: `/expenses/${expenseUuid}`,
        method: 'PATCH',
        body: {
          product,
          quantity,
          unitPrice,
          establishment,
          measure,
          currency,
          date,
        },
      }),
      invalidatesTags: (result, error, { expenseUuid }) => [
        { type: 'Expense', id: expenseUuid },
      ],
    }),

    removeExpense: builder.mutation({
      query: (expenseUuid) => ({
        url: `/expenses/${expenseUuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Expense', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchAllExpensesQuery,
  useFetchExpenseByUuidQuery,
  useAddExpenseMutation,
  useEditExpenseMutation,
  useRemoveExpenseMutation,
} = expensesApi;
