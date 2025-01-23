export const selectModerations = (state) => state.moderations.list;
export const selectTotalCount = (state) => state.moderations.totalCount;
export const selectSelectedItem = (state) => state.moderations.selected;

export const selectModerationsIsLoadingList = (state) =>
  state.moderations.isLoadingList;
export const selectModerationsListLoadingError = (state) =>
  state.moderations.listLoadingError;

export const selectModerationsProcessingAction = (state) =>
  state.moderations.isProcessingAction;
export const selectModerationsActionError = (state) =>
  state.moderations.actionError;
