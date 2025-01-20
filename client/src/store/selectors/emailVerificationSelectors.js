export const selectEmailVerification = (state) =>
  state.emailVerification.status;
export const selectEmailVerificationIsLoading = (state) =>
  state.emailVerification.isLoading;
export const selectEmailVerificationError = (state) =>
  state.emailVerification.error;
