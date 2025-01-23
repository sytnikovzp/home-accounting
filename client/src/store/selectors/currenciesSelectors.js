export const selectCurrencies = (state) => state.currencies.list;
export const selectTotalCount = (state) => state.currencies.totalCount;
export const selectSelectedCurrency = (state) => state.currencies.selected;

export const selectCurrenciesIsLoadingList = (state) =>
  state.currencies.isLoadingList;
export const selectCurrenciesListLoadingError = (state) =>
  state.currencies.listLoadingError;

export const selectCurrenciesProcessingAction = (state) =>
  state.currencies.isProcessingAction;
export const selectCurrenciesActionError = (state) =>
  state.currencies.actionError;
