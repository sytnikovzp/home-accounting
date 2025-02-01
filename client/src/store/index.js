import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import {
  categoriesApi,
  currenciesApi,
  emailApi,
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

import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [currenciesApi.reducerPath]: currenciesApi.reducer,
    [emailApi.reducerPath]: emailApi.reducer,
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
      categoriesApi.middleware,
      currenciesApi.middleware,
      emailApi.middleware,
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
