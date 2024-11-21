import api from '../interceptor';
// ==============================================================
import { setAccessToken, clearAccessToken } from '../../utils/sharedFunctions';

const registration = async (fullName, email, password) => {
  const { data } = await api.post('/auth/registration', {
    fullName,
    email,
    password,
  });
  setAccessToken(data.accessToken);
  return data;
};

const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  setAccessToken(data.accessToken);
  return data;
};

const logout = async () => {
  await api.get('/auth/logout');
  clearAccessToken();
};

const refreshAccessToken = async (originalRequest) => {
  try {
    const { data } = await api.get('/auth/refresh');
    setAccessToken(data.accessToken);
    originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
    return api.request(originalRequest);
  } catch (err) {
    if (err.response?.status === 401) {
      console.warn('Access token expired and refresh failed.');
      clearAccessToken();
    }
    return Promise.reject(err);
  }
};

export default { registration, login, logout, refreshAccessToken };
