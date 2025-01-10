import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import categoriesReducer from './slices/categoriesSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
