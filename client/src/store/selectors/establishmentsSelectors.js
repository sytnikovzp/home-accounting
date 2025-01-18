export const selectEstablishments = (state) => state.establishments.data;
export const selectTotalCount = (state) => state.establishments.totalCount;
export const selectCurrentEstablishment = (state) =>
  state.establishments.current;
export const selectIsLoading = (state) => state.establishments.isLoading;
export const selectError = (state) => state.establishments.error;
