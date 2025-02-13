import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { configs } from '../../constants';
import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from '../../utils/sharedFunctions';

import { logout } from '../slices/authUserSlice';

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

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.warn('Access token expired. Trying to refresh...');

    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'GET' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newToken = refreshResult.data.accessToken;
      saveAccessToken(newToken);
      const newArgs =
        typeof args === 'string'
          ? { url: args, method: 'GET', headers: new Headers() }
          : { ...args, headers: new Headers(args.headers) };

      newArgs.headers.set('Authorization', `Bearer ${newToken}`);
      result = await baseQuery(newArgs, api, extraOptions);
    } else {
      console.warn('Token refresh failed. Logging out...');
      removeAccessToken();
      api.dispatch(logout());
    }
  }

  return result;
};

export { baseQuery, baseQueryWithReauth };
