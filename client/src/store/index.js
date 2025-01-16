import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import categoriesReducer from './slices/categoriesSlice';
import currenciesReducer from './slices/currenciesSlice';
import nbuExchangesReducer from './slices/nbuExchangesSlice';
import statisticsReducer from './slices/statisticsSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    currencies: currenciesReducer,
    nbuExchanges: nbuExchangesReducer,
    statistics: statisticsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
