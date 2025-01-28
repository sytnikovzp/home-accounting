import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { configs } from '../../constants';

const { CURRENCY_CODES, NBU_STAT_URL } = configs;

export const nbuRatesApi = createApi({
  reducerPath: 'nbuRatesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: NBU_STAT_URL,
  }),
  endpoints: (builder) => ({
    fetchNBURates: builder.query({
      query: () => ({
        url: '/statdirectory/exchange?json',
        method: 'GET',
      }),
      transformResponse: (response) =>
        response.filter(({ cc }) => CURRENCY_CODES.includes(cc)),
    }),
  }),
});

export const { useFetchNBURatesQuery } = nbuRatesApi;
