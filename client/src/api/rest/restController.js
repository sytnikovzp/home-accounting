import {
  forgotPassword,
  login,
  logout,
  refreshAccessToken,
  registration,
  resetPassword,
} from '../../services/authService';

const restController = {
  // Authentication
  registration: (fullName, email, password) =>
    registration(fullName, email, password),
  login: (email, password) => login(email, password),
  logout: () => logout(),
  refreshAccessToken: (originalRequest) => refreshAccessToken(originalRequest),
  forgotPassword: (email) => forgotPassword(email),
  resetPassword: (token, newPassword, confirmNewPassword) =>
    resetPassword(token, newPassword, confirmNewPassword),
};

export default restController;
