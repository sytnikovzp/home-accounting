import axios from 'axios';
// ==============================================================
import api from '../api';

const getNBURates = async () => {
  const response = await axios.get(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
  );
  return response.data;
};

const getAllCurrencies = async ({ page = 1, limit = 5 } = {}) => {
  const response = await api.get(`/currencies?page=${page}&limit=${limit}`);
  const totalCount = parseInt(response.headers['x-total-count']);
  return {
    data: response.data,
    totalCount,
  };
};

const getCurrencyById = async (currencyId) => {
  const response = await api.get(`/currencies/${currencyId}`);
  return response.data;
};

const createCurrency = async (title, description) => {
  const response = await api.post('/currencies', {
    title,
    description,
  });
  return response.data;
};

const updateCurrency = async (currencyId, title, description) => {
  const response = await api.patch(`/currencies/${currencyId}`, {
    title,
    description,
  });
  return response.data;
};

const deleteCurrency = async (currencyId) => {
  const response = await api.delete(`/currencies/${currencyId}`);
  return response.data;
};

export default {
  getNBURates,
  getAllCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
};