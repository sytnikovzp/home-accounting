import api from '../api';
// ==============================================================
import { saveAccessToken, removeAccessToken } from '../utils/sharedFunctions';

const registration = async (fullName, email, password) => {
  const { data } = await api.post('/auth/registration', {
    fullName,
    email,
    password,
  });
  saveAccessToken(data.accessToken);
  return data;
};

const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  saveAccessToken(data.accessToken);
  return data;
};

const logout = async () => {
  await api.get('/auth/logout');
  removeAccessToken();
};

const refreshAccessToken = async () => {
  const { data } = await api.get('/auth/refresh');
  saveAccessToken(data.accessToken);
  return data;
};

export default { registration, login, logout, refreshAccessToken };
