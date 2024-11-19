/* eslint-disable no-underscore-dangle */
import axios from 'axios';
// ==============================================================
import { BASE_URL } from '../constants';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const handleError = (error, customMessage = 'API Error') => {
  const message =
    error.response?.data?.message || error.message || customMessage;
  console.error(`${customMessage}: ${message}`);
  throw new Error(message);
};

const getAccessToken = () => localStorage.getItem('accessToken');

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const accessToken = getAccessToken();
    if (!accessToken) {
      console.log('No AccessToken, need to sign in');
      return null;
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.get('/auth/refresh');
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        localStorage.setItem('accessToken', data.accessToken);
        return api.request(originalRequest);
      } catch (err) {
        if (err.response.status === 401) {
          console.warn('Access token expired and refresh failed.');
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    return handleError(error, 'Error fetching user profile');
  }
};

export const logout = async () => {
  try {
    await api.get('/auth/logout');
    localStorage.removeItem('accessToken');
  } catch (error) {
    return handleError(error, 'Logout error');
  }
};

export const getNBURates = async () => {
  try {
    const response = await axios.get(
      'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
    );
    return response.data;
  } catch (error) {
    return handleError(error, 'Error fetching currency exchange');
  }
};

export default api;
