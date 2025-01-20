export const selectPermissions = (state) => state.permissions.data;
export const selectPermissionsIsLoading = (state) =>
  state.permissions.isLoading;
export const selectPermissionsError = (state) => state.permissions.error;
