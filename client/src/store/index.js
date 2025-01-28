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
import expensesReducer from './slices/expensesSlice';
import measuresReducer from './slices/measuresSlice';
import moderationsReducer from './slices/moderationsSlice';
import permissionsReducer from './slices/permissionsSlice';
import productsReducer from './slices/productsSlice';
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
    expenses: expensesReducer,
    measures: measuresReducer,
    moderations: moderationsReducer,
    [nbuRatesApi.reducerPath]: nbuRatesApi.reducer,
    permissions: permissionsReducer,
    products: productsReducer,
    roles: rolesReducer,
    statistics: statisticsReducer,
    userProfile: userProfileReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      categoriesApi.middleware,
      currenciesApi.middleware,
      nbuRatesApi.middleware,
      logger
    ),
});

export default store;
