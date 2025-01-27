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
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const originalRequest = { ...args };
    try {
      const refreshResult = await baseQuery(
        { url: '/auth/refresh', method: 'GET' },
        api,
        extraOptions
      );
      if (refreshResult.data) {
        const newToken = refreshResult.data.accessToken;
        saveAccessToken(newToken);
        if (!originalRequest.headers) {
          originalRequest.headers = new Headers();
        }
        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        result = await baseQuery(originalRequest, api, extraOptions);
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (err) {
      console.warn('Token refresh failed', err);
      removeAccessToken();
    }
  }

  return result;
};

export { baseQuery, baseQueryWithReauth };
