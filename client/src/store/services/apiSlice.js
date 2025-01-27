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

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      const response = await baseQuery(
        {
          url: 'auth/refresh',
          method: 'GET',
        },
        api,
        extraOptions
      );

      if (response.data) {
        saveAccessToken(response.data.accessToken);
        result = await baseQuery(args, api, extraOptions);
      }
    } catch (error) {
      console.warn('Token refresh failed', error);
      removeAccessToken();
    }
  }

  return result;
};
export { baseQuery, baseQueryWithReauth };
