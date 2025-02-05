import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { configs } from '../../constants';
import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from '../../utils/sharedFunctions';

const { BASE_URL } = configs;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

let refreshSubscribers = [];

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const originalRequest = args;

    if (originalRequest._retry) {
      return result;
    }

    originalRequest._retry = true;

    try {
      const response = await baseQuery(
        { url: '/auth/refresh', method: 'GET' },
        api,
        extraOptions
      );

      if (response.data) {
        saveAccessToken(response.data.accessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] =
          `Bearer ${response.data.accessToken}`;

        for (const callback of refreshSubscribers) {
          callback(response.data.accessToken);
        }
        refreshSubscribers = [];

        return baseQuery(originalRequest, api, extraOptions);
      }
    } catch (error) {
      console.warn('Token refresh failed', error);
      removeAccessToken();
      refreshSubscribers = [];
    }
  }

  return result;
};

export { baseQuery, baseQueryWithReauth };
