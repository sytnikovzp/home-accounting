import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import categoriesReducer from './slices/categoriesSlice';
import currenciesReducer from './slices/currenciesSlice';
import establishmentsReducer from './slices/establishmentsSlice';
import measuresReducer from './slices/measuresSlice';
import nbuExchangesReducer from './slices/nbuExchangesSlice';
import productsReducer from './slices/productsSlice';
import statisticsReducer from './slices/statisticsSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    currencies: currenciesReducer,
    establishments: establishmentsReducer,
    measures: measuresReducer,
    nbuExchanges: nbuExchangesReducer,
    products: productsReducer,
    statistics: statisticsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
