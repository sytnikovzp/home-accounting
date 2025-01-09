import {
  removeAccessToken,
  requestHandler,
  saveAccessToken,
} from '../utils/sharedFunctions';

const registration = async (fullName, email, password) => {
  const response = await requestHandler({
    url: '/auth/registration',
    method: 'POST',
    data: { fullName, email, password },
  });
  saveAccessToken(response.accessToken);
  return response;
};

const login = async (email, password) => {
  const response = await requestHandler({
    url: '/auth/login',
    method: 'POST',
    data: { email, password },
  });
  saveAccessToken(response.accessToken);
  return response;
};

const logout = async () => {
  await requestHandler({
    url: '/auth/logout',
    method: 'GET',
  });
  removeAccessToken();
};

const refreshAccessToken = async () => {
  const response = await requestHandler({
    url: '/auth/refresh',
    method: 'GET',
  });
  saveAccessToken(response.accessToken);
  return response;
};

const resendVerifyEmail = async (email) => {
  const response = await requestHandler({
    url: '/auth/resend-verify',
    method: 'POST',
    data: { email },
  });
  return response;
};

const forgotPassword = async (email) => {
  const response = await requestHandler({
    url: '/auth/forgot',
    method: 'POST',
    data: { email },
  });
  return response;
};

const resetPassword = async (token, newPassword, confirmNewPassword) => {
  const response = await requestHandler({
    url: `/auth/reset?token=${token}`,
    method: 'POST',
    data: { newPassword, confirmNewPassword },
  });
  return response;
};

export default {
  registration,
  login,
  logout,
  refreshAccessToken,
  resendVerifyEmail,
  forgotPassword,
  resetPassword,
};
