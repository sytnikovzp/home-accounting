export const selectCurrencies = (state) => state.currencies.data;
export const selectTotalCount = (state) => state.currencies.totalCount;
export const selectCurrentCurrency = (state) => state.currencies.current;
export const selectCurrenciesIsLoading = (state) => state.currencies.isLoading;
export const selectCurrenciesError = (state) => state.currencies.error;
