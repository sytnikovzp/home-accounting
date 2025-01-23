export const selectCategories = (state) => state.categories.list;
export const selectTotalCount = (state) => state.categories.totalCount;
export const selectSelectedCategory = (state) => state.categories.selected;

export const selectCategoriesIsLoadingList = (state) =>
  state.categories.isLoadingList;
export const selectCategoriesListLoadingError = (state) =>
  state.categories.listLoadingError;

export const selectCategoriesProcessingAction = (state) =>
  state.categories.isProcessingAction;
export const selectCategoriesActionError = (state) =>
  state.categories.actionError;
