import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import categoriesReducer from './slices/categoriesSlice';
import currenciesReducer from './slices/currenciesSlice';
import measuresReducer from './slices/measuresSlice';
import nbuExchangesReducer from './slices/nbuExchangesSlice';
import statisticsReducer from './slices/statisticsSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    currencies: currenciesReducer,
    measures: measuresReducer,
    nbuExchanges: nbuExchangesReducer,
    statistics: statisticsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
