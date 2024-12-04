import axios from 'axios';
// ==============================================================
import api from '../api';

const getNBURates = async () => {
  const response = await axios.get(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
  );
  return response.data;
};

const getAllCurrencies = async ({
  page = 1,
  limit = 6,
  sort = 'id',
  order = 'asc',
} = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    sort,
    order,
  }).toString();
  try {
    const response = await api.get(`/currencies?${params}`);
    const totalCount = parseInt(response.headers['x-total-count']);
    return {
      data: response.data,
      totalCount,
    };
  } catch (error) {
    console.error(error.response.data.errors[0].title);
    return {
      data: [],
      totalCount: 0,
    };
  }
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
