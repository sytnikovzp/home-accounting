export const selectUsers = (state) => state.users.list;
export const selectTotalCount = (state) => state.users.totalCount;
export const selectSelectedUser = (state) => state.users.selected;

export const selectUsersIsLoadingList = (state) => state.users.isLoadingList;
export const selectUsersListLoadingError = (state) =>
  state.users.listLoadingError;

export const selectUsersProcessingAction = (state) =>
  state.users.isProcessingAction;
export const selectUsersActionError = (state) => state.users.actionError;
