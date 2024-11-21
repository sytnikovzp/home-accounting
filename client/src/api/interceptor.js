/* eslint-disable no-underscore-dangle */
import axios from 'axios';
// ==============================================================
import { BASE_URL } from '../constants';
import restController from './rest/restController';
import { getAccessToken } from '../utils/sharedFunctions';

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
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const token = getAccessToken();
    if (!token) {
      return null;
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      restController.refreshAccessToken(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
