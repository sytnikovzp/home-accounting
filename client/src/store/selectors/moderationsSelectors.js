export const selectModerations = (state) => state.moderations.data;
export const selectTotalCount = (state) => state.moderations.totalCount;
export const selectCurrentItem = (state) => state.moderations.current;
export const selectModerationsIsLoading = (state) =>
  state.moderations.isLoading;
export const selectModerationsError = (state) => state.moderations.error;
