import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: ({
        status = 'approved',
        page = 1,
        limit = 6,
        sort = 'uuid',
        order = 'asc',
      }) => ({
        url: 'products',
        method: 'GET',
        params: { status, page, limit, sort, order },
      }),
      transformResponse: (response, meta) => ({
        data: response,
        totalCount: parseInt(meta.response.headers.get('x-total-count')) || 0,
      }),
      providesTags: (result) => {
        if (result?.data) {
          return [
            ...result.data.map(({ uuid }) => ({
              type: 'Product',
              id: uuid,
            })),
            { type: 'Product', id: 'LIST' },
          ];
        }
        return [{ type: 'Product', id: 'LIST' }];
      },
    }),

    fetchProductByUuid: builder.query({
      query: (productUuid) => ({
        url: `products/${productUuid}`,
        method: 'GET',
      }),
      providesTags: (result, error, productUuid) => [
        { type: 'Product', id: productUuid },
      ],
    }),

    addProduct: builder.mutation({
      query: ({ title, category = '' }) => ({
        url: 'products',
        method: 'POST',
        body: { title, category },
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    editProduct: builder.mutation({
      query: ({ productUuid, title, category }) => ({
        url: `products/${productUuid}`,
        method: 'PATCH',
        body: { title, category },
      }),
      invalidatesTags: (result, error, { productUuid }) => [
        { type: 'Product', id: productUuid },
      ],
    }),

    removeProduct: builder.mutation({
      query: (productUuid) => ({
        url: `products/${productUuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useFetchProductByUuidQuery,
  useAddProductMutation,
  useEditProductMutation,
  useRemoveProductMutation,
} = productsApi;
