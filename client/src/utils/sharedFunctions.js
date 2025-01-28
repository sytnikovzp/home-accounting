import api from '../api';

import { stylesHeaderUserAvatar } from '../styles';

const getAccessToken = () => {
  const token = localStorage.getItem('accessToken');
  if (token === 'undefined') {
    localStorage.removeItem('accessToken');
    return null;
  }
  return token;
};

const saveAccessToken = (token) => localStorage.setItem('accessToken', token);

const removeAccessToken = () => localStorage.removeItem('accessToken');

const uuidPattern = /[\dA-Fa-f-]{36}/;

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + hash * 31;
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash / Math.pow(256, i)) % 256;
    color += `00${Math.floor(value).toString(16)}`.slice(-2);
  }
  return color;
};

const stringAvatar = (fullName) => {
  if (!fullName || typeof fullName !== 'string') {
    return {
      sx: {
        ...stylesHeaderUserAvatar,
        backgroundColor: stringToColor(''),
      },
      children: '',
    };
  }
  const words = fullName.trim().split(' ');
  const firstLetter = words[0] ? words[0][0].toUpperCase() : '';
  const secondLetter = words[1] ? words[1][0].toUpperCase() : '';
  return {
    sx: {
      ...stylesHeaderUserAvatar,
      backgroundColor: stringToColor(fullName),
    },
    children: `${firstLetter}${secondLetter}`,
  };
};

const requestHandler = async ({
  url,
  method = 'GET',
  data = {},
  params = {},
}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const headers =
      url.includes('logo') || url.includes('photo')
        ? { 'Content-Type': 'multipart/form-data' }
        : {};
    const response = await api({
      url: `${url}${queryParams && `?${queryParams}`}`,
      method,
      headers,
      ...(method === 'GET' || method === 'DELETE' ? {} : { data }),
    });
    if (method === 'GET' && response.headers['x-total-count']) {
      const totalCount = parseInt(response.headers['x-total-count']);
      return {
        data: response.data,
        totalCount,
      };
    }
    return response.data;
  } catch (error) {
    if (method === 'GET' && url.includes('/refresh')) {
      return null;
    }
    if (method === 'GET') {
      return {
        data: [],
        totalCount: 0,
      };
    }
    throw error;
  }
};

const groupByFirstLetter = (items, labelKey, valueKey) =>
  items
    .sort((a, b) => a[labelKey].localeCompare(b[labelKey]))
    .reduce((acc, item) => {
      const firstLetter = item[labelKey][0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push({
        label: item[labelKey],
        value: item[valueKey],
      });
      return acc;
    }, {});

const setErrorListState = (state, { payload }) => {
  state.isLoadingList = false;
  state.listLoadingError = payload;
};

const setLoadingListState = (state) => {
  state.isLoadingList = true;
  state.listLoadingError = null;
};

const setLoadingActionState = (state) => {
  state.isProcessingAction = true;
  state.actionError = null;
};

const setErrorActionState = (state, { payload }) => {
  state.isProcessingAction = false;
  state.actionError = payload;
};

const setErrorState = (state, { payload }) => {
  state.isLoading = false;
  state.error = payload;
};

const setLoadingState = (state) => {
  state.isLoading = true;
  state.error = null;
};

export {
  getAccessToken,
  groupByFirstLetter,
  removeAccessToken,
  requestHandler,
  saveAccessToken,
  setErrorActionState,
  setErrorListState,
  setErrorState,
  setLoadingActionState,
  setLoadingListState,
  setLoadingState,
  stringAvatar,
  uuidPattern,
};
