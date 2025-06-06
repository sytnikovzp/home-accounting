import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import {
  authApi,
  categoriesApi,
  currenciesApi,
  establishmentsApi,
  expensesApi,
  measuresApi,
  moderationApi,
  nbuRatesApi,
  permissionsApi,
  productsApi,
  rolesApi,
  statisticsApi,
  userProfileApi,
  usersApi,
} from './services';
import authenticationReducer from './slices/authenticationSlice';

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [currenciesApi.reducerPath]: currenciesApi.reducer,
    [establishmentsApi.reducerPath]: establishmentsApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [measuresApi.reducerPath]: measuresApi.reducer,
    [moderationApi.reducerPath]: moderationApi.reducer,
    [nbuRatesApi.reducerPath]: nbuRatesApi.reducer,
    [permissionsApi.reducerPath]: permissionsApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [statisticsApi.reducerPath]: statisticsApi.reducer,
    [userProfileApi.reducerPath]: userProfileApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoriesApi.middleware,
      currenciesApi.middleware,
      establishmentsApi.middleware,
      expensesApi.middleware,
      measuresApi.middleware,
      moderationApi.middleware,
      nbuRatesApi.middleware,
      permissionsApi.middleware,
      productsApi.middleware,
      rolesApi.middleware,
      statisticsApi.middleware,
      userProfileApi.middleware,
      usersApi.middleware,
      logger
    ),
});

export default store;
