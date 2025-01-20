import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import categoriesReducer from './slices/categoriesSlice';
import currenciesReducer from './slices/currenciesSlice';
import establishmentsReducer from './slices/establishmentsSlice';
import expensesReducer from './slices/expensesSlice';
import measuresReducer from './slices/measuresSlice';
import nbuExchangesReducer from './slices/nbuExchangesSlice';
import permissionsReducer from './slices/permissionsSlice';
import productsReducer from './slices/productsSlice';
import rolesReducer from './slices/rolesSlice';
import statisticsReducer from './slices/statisticsSlice';
import usersReducer from './slices/usersSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    currencies: currenciesReducer,
    establishments: establishmentsReducer,
    expenses: expensesReducer,
    measures: measuresReducer,
    nbuExchanges: nbuExchangesReducer,
    permissions: permissionsReducer,
    products: productsReducer,
    roles: rolesReducer,
    statistics: statisticsReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
