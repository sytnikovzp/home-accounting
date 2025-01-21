export const selectUserProfile = (state) => state.userProfile.data;
export const selectUserProfileIsLoading = (state) =>
  state.userProfile.isLoading;
export const selectUserProfileError = (state) => state.userProfile.error;
