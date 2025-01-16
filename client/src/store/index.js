import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import categoriesReducer from './slices/categoriesSlice';
import statisticsReducer from './slices/statisticsSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    statistics: statisticsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
