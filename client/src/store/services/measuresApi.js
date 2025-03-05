import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const measuresApi = createApi({
  reducerPath: 'measuresApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Measure'],
  endpoints: (builder) => ({
    fetchAllMeasures: builder.query({
      query: ({ page = 1, limit = 6, sort = 'uuid', order = 'asc' }) => ({
        url: '/measures',
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
              type: 'Measure',
              id: uuid,
            })),
            { type: 'Measure', id: 'LIST' },
          ];
        }
        return [{ type: 'Measure', id: 'LIST' }];
      },
    }),

    fetchMeasureByUuid: builder.query({
      query: (measureUuid) => ({
        url: `/measures/${measureUuid}`,
        method: 'GET',
      }),
      providesTags: (response, error, measureUuid) => [
        { type: 'Measure', id: measureUuid },
      ],
    }),

    addMeasure: builder.mutation({
      query: ({ title, description }) => ({
        url: '/measures',
        method: 'POST',
        body: { title, description },
      }),
      invalidatesTags: [{ type: 'Measure', id: 'LIST' }],
    }),

    editMeasure: builder.mutation({
      query: ({ measureUuid, title, description }) => ({
        url: `/measures/${measureUuid}`,
        method: 'PATCH',
        body: { title, description },
      }),
      invalidatesTags: (response, error, { measureUuid }) => [
        { type: 'Measure', id: measureUuid },
      ],
    }),

    removeMeasure: builder.mutation({
      query: (measureUuid) => ({
        url: `/measures/${measureUuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Measure', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchAllMeasuresQuery,
  useFetchMeasureByUuidQuery,
  useAddMeasureMutation,
  useEditMeasureMutation,
  useRemoveMeasureMutation,
} = measuresApi;
