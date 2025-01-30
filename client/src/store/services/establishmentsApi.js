import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './apiSlice';

export const establishmentsApi = createApi({
  reducerPath: 'establishmentsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Establishment'],
  endpoints: (builder) => ({
    fetchAllEstablishments: builder.query({
      query: ({
        status = 'approved',
        page = 1,
        limit = 6,
        sort = 'uuid',
        order = 'asc',
      }) => ({
        url: 'establishments',
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
              type: 'Establishment',
              id: uuid,
            })),
            { type: 'Establishment', id: 'LIST' },
          ];
        }
        return [{ type: 'Establishment', id: 'LIST' }];
      },
    }),

    fetchEstablishmentByUuid: builder.query({
      query: (establishmentUuid) => ({
        url: `establishments/${establishmentUuid}`,
        method: 'GET',
      }),
      providesTags: (result, error, establishmentUuid) => [
        { type: 'Establishment', id: establishmentUuid },
      ],
    }),

    addEstablishment: builder.mutation({
      query: ({ title, description = '', url = '' }) => ({
        url: 'establishments',
        method: 'POST',
        body: { title, description, url },
      }),
      invalidatesTags: [{ type: 'Establishment', id: 'LIST' }],
    }),

    editEstablishment: builder.mutation({
      query: ({ establishmentUuid, title, description, url }) => ({
        url: `establishments/${establishmentUuid}`,
        method: 'PATCH',
        body: { title, description, url },
      }),
      invalidatesTags: (result, error, { establishmentUuid }) => [
        { type: 'Establishment', id: establishmentUuid },
      ],
    }),

    changeEstablishmentLogo: builder.mutation({
      query: ({ establishmentUuid, establishmentLogo }) => {
        const formData = new FormData();
        formData.append('establishmentLogo', establishmentLogo);
        return {
          url: `establishments/${establishmentUuid}/logo`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { establishmentUuid }) => [
        { type: 'Establishment', id: establishmentUuid },
      ],
    }),

    resetEstablishmentLogo: builder.mutation({
      query: (establishmentUuid) => ({
        url: `establishments/${establishmentUuid}/logo`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { establishmentUuid }) => [
        { type: 'Establishment', id: establishmentUuid },
      ],
    }),

    removeEstablishment: builder.mutation({
      query: (establishmentUuid) => ({
        url: `establishments/${establishmentUuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Establishment', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchAllEstablishmentsQuery,
  useFetchEstablishmentByUuidQuery,
  useAddEstablishmentMutation,
  useEditEstablishmentMutation,
  useChangeEstablishmentLogoMutation,
  useResetEstablishmentLogoMutation,
  useRemoveEstablishmentMutation,
} = establishmentsApi;
