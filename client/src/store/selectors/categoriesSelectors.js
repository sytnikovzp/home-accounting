export const selectCategories = (state) => state.categories.data;
export const selectTotalCount = (state) => state.categories.totalCount;
export const selectCurrentCategory = (state) => state.categories.current;
export const selectCategoriesIsLoading = (state) => state.categories.isLoading;
export const selectCategoriesError = (state) => state.categories.error;
