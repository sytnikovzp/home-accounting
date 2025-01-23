export const selectRoles = (state) => state.roles.list;
export const selectTotalCount = (state) => state.roles.totalCount;
export const selectSelectedRole = (state) => state.roles.selected;

export const selectRolesIsLoadingList = (state) => state.roles.isLoadingList;
export const selectRolesListLoadingError = (state) =>
  state.roles.listLoadingError;

export const selectRolesProcessingAction = (state) =>
  state.roles.isProcessingAction;
export const selectRolesActionError = (state) => state.roles.actionError;
