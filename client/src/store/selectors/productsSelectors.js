export const selectProducts = (state) => state.products.list;
export const selectTotalCount = (state) => state.products.totalCount;
export const selectSelectedProduct = (state) => state.products.selected;

export const selectProductsIsLoadingList = (state) =>
  state.products.isLoadingList;
export const selectProductsListLoadingError = (state) =>
  state.products.listLoadingError;

export const selectProductsProcessingAction = (state) =>
  state.products.isProcessingAction;
export const selectProductsActionError = (state) => state.products.actionError;
