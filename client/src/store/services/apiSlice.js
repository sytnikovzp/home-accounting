import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_CONFIG } from '../../constants';
import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from '../../utils/authHelpers';

import { clearAuthenticationState } from '../slices/authenticationSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
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
  let response = await baseQuery(args, api, extraOptions);

  if (response.error?.status === 401) {
    const token = getAccessToken();

    if (!token) {
      return response;
    }

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
      response = await baseQuery(newArgs, api, extraOptions);
    } else {
      console.warn('Token refresh failed. Logging out...');
      removeAccessToken();
      api.dispatch(clearAuthenticationState());
    }
  }

  return response;
};

export { baseQuery, baseQueryWithReauth };
