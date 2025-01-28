import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import {
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

import authReducer from './slices/authSlice';
import emailVerificationReducer from './slices/emailVerificationSlice';
import establishmentsReducer from './slices/establishmentsSlice';
import moderationsReducer from './slices/moderationsSlice';
import permissionsReducer from './slices/permissionsSlice';
import rolesReducer from './slices/rolesSlice';
import statisticsReducer from './slices/statisticsSlice';
import userProfileReducer from './slices/userProfileSlice';
import usersReducer from './slices/usersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [currenciesApi.reducerPath]: currenciesApi.reducer,
    emailVerification: emailVerificationReducer,
    establishments: establishmentsReducer,
    [establishmentsApi.reducerPath]: establishmentsApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [measuresApi.reducerPath]: measuresApi.reducer,
    moderations: moderationsReducer,
    [nbuRatesApi.reducerPath]: nbuRatesApi.reducer,
    permissions: permissionsReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    roles: rolesReducer,
    statistics: statisticsReducer,
    userProfile: userProfileReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      categoriesApi.middleware,
      currenciesApi.middleware,
      establishmentsApi.middleware,
      expensesApi.middleware,
      measuresApi.middleware,
      nbuRatesApi.middleware,
      productsApi.middleware,
      logger
    ),
});

export default store;
