export const selectCurrencies = (state) => state.currencies.data;
export const selectTotalCount = (state) => state.currencies.totalCount;
export const selectCurrentCurrency = (state) => state.currencies.current;
export const selectIsLoading = (state) => state.currencies.isLoading;
export const selectError = (state) => state.currencies.error;
