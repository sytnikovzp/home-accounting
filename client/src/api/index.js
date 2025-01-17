import axios from 'axios';

import { configs } from '../constants';
import { getAccessToken, removeAccessToken } from '../utils/sharedFunctions';
import restController from './rest/restController';

const { BASE_URL } = configs;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    const token = getAccessToken();
    if (!token) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { accessToken } = await restController.refreshAccessToken();
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api.request(originalRequest);
      } catch (err) {
        if (err.response?.status === 401) {
          console.warn('Access token expired and refresh failed.');
          removeAccessToken();
        }
        if (err.response?.status === 404) {
          console.warn('User not found. Removing access token.');
          removeAccessToken();
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
