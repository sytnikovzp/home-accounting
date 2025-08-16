import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';

import { API_CONFIG, APP_SETTINGS } from '@/src/constants';

export const nbuRatesApi = createApi({
  reducerPath: 'nbuRatesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.NBU_STAT_URL,
  }),
  endpoints: (builder) => ({
    fetchNBURates: builder.query({
      query: () => ({
        url: '/statdirectory/exchange?json',
        method: 'GET',
      }),
      transformResponse: (response) =>
        response.filter(({ cc }) => APP_SETTINGS.CURRENCY_CODES.includes(cc)),
    }),
  }),
});

export const { useFetchNBURatesQuery } = nbuRatesApi;
