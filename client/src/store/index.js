import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import authReducer from './slices/authSlice';
import categoriesReducer from './slices/categoriesSlice';
import currenciesReducer from './slices/currenciesSlice';
import emailVerificationReducer from './slices/emailVerificationSlice';
import establishmentsReducer from './slices/establishmentsSlice';
import expensesReducer from './slices/expensesSlice';
import measuresReducer from './slices/measuresSlice';
import moderationsReducer from './slices/moderationsSlice';
import nbuExchangesReducer from './slices/nbuExchangesSlice';
import permissionsReducer from './slices/permissionsSlice';
import productsReducer from './slices/productsSlice';
import rolesReducer from './slices/rolesSlice';
import statisticsReducer from './slices/statisticsSlice';
import userProfileReducer from './slices/userProfileSlice';
import usersReducer from './slices/usersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    currencies: currenciesReducer,
    emailVerification: emailVerificationReducer,
    establishments: establishmentsReducer,
    expenses: expensesReducer,
    measures: measuresReducer,
    moderations: moderationsReducer,
    nbuExchanges: nbuExchangesReducer,
    permissions: permissionsReducer,
    products: productsReducer,
    roles: rolesReducer,
    statistics: statisticsReducer,
    userProfile: userProfileReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
