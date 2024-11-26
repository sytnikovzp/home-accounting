/* eslint-disable no-underscore-dangle */
import axios from 'axios';
// ==============================================================
import { BASE_URL } from '../constants';
// ==============================================================
import restController from './rest/restController';
// ==============================================================
import { getAccessToken, removeAccessToken } from '../utils/sharedFunctions';

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
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    const token = getAccessToken();
    if (!token) {
      return null;
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
      }
    }
    return Promise.reject(error);
  }
);

export default api;
