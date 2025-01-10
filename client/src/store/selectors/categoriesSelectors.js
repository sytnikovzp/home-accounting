export const selectCategoriesState = (state) => state.categories;

export const selectCategories = (state) => selectCategoriesState(state).data;

export const selectCategoriesTotalCount = (state) =>
  selectCategoriesState(state).totalCount;

export const selectCurrentCategory = (state) =>
  selectCategoriesState(state).current;

export const selectCategoriesLoading = (state) =>
  selectCategoriesState(state).loading;

export const selectCategoriesError = (state) =>
  selectCategoriesState(state).error;

export const selectCategoriesShowPreloader = (state) =>
  selectCategoriesLoading(state) && !selectCategories(state).length;

export const selectCategoryByUuid = (state, uuid) => {
  const { current, data } = selectCategoriesState(state);
  return current?.uuid === uuid
    ? current
    : data.find((category) => category.uuid === uuid);
};
