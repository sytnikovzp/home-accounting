export const selectPermissions = (state) => state.permissions.list;

export const selectPermissionsIsLoadingList = (state) =>
  state.permissions.isLoadingList;
export const selectPermissionsListLoadingError = (state) =>
  state.permissions.listLoadingError;
