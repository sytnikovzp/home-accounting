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
import moderationsReducer from './slices/moderationsSlice';
import permissionsReducer from './slices/permissionsSlice';
import rolesReducer from './slices/rolesSlice';
import statisticsReducer from './slices/statisticsSlice';
import userProfileReducer from './slices/userProfileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [currenciesApi.reducerPath]: currenciesApi.reducer,
    [emailApi.reducerPath]: emailApi.reducer,
    [establishmentsApi.reducerPath]: establishmentsApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [measuresApi.reducerPath]: measuresApi.reducer,
    moderations: moderationsReducer,
    [nbuRatesApi.reducerPath]: nbuRatesApi.reducer,
    permissions: permissionsReducer,
    [permissionsApi.reducerPath]: permissionsApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    roles: rolesReducer,
    statistics: statisticsReducer,
    userProfile: userProfileReducer,
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
      nbuRatesApi.middleware,
      permissionsApi.middleware,
      productsApi.middleware,
      rolesApi.middleware,
      usersApi.middleware,
      logger
    ),
});

export default store;
