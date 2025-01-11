export const selectCategoriesState = (state) => state.categories;

export const selectCategories = (state) => selectCategoriesState(state).list;

export const selectCategoriesTotalCount = (state) =>
  selectCategoriesState(state).totalCount;

export const selectCurrentCategory = (state) =>
  selectCategoriesState(state).current;

export const selectCategoriesLoading = (state) =>
  selectCategoriesState(state).isLoading;

export const selectCategoriesError = (state) =>
  selectCategoriesState(state).error;

export const selectCategoriesShowPreloader = (state) =>
  selectCategoriesLoading(state) && !selectCategories(state).length;

export const selectCategoryByUuid = (state, uuid) => {
  const { current, list } = selectCategoriesState(state);
  return current?.uuid === uuid
    ? current
    : list.find((category) => category.uuid === uuid);
};
