export const selectProducts = (state) => state.products.data;
export const selectTotalCount = (state) => state.products.totalCount;
export const selectCurrentProduct = (state) => state.products.current;
export const selectProductsIsLoading = (state) => state.products.isLoading;
export const selectProductsError = (state) => state.products.error;
