export const selectProducts = (state) => state.products.data;
export const selectTotalCount = (state) => state.products.totalCount;
export const selectCurrentProduct = (state) => state.products.current;
export const selectIsLoading = (state) => state.products.isLoading;
export const selectError = (state) => state.products.error;
