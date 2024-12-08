import axios from 'axios';
// ==============================================================
import api from '../api';

const getNBURates = async () => {
  const { data } = await axios.get(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
  );
  return data;
};

const getAllCurrencies = async (
  page = 1,
  limit = 6,
  sort = 'id',
  order = 'asc'
) => {
  const params = new URLSearchParams(page, limit, sort, order).toString();
  try {
    const { data, headers } = await api.get(`/currencies?${params}`);
    const totalCount = parseInt(headers['x-total-count']);
    return {
      data,
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
  const { data } = await api.get(`/currencies/${currencyId}`);
  return data;
};

const createCurrency = async (title, description) => {
  const { data } = await api.post('/currencies', {
    title,
    description,
  });
  return data;
};

const updateCurrency = async (currencyId, title, description) => {
  const { data } = await api.patch(`/currencies/${currencyId}`, {
    title,
    description,
  });
  return data;
};

const deleteCurrency = async (currencyId) => {
  const { data } = await api.delete(`/currencies/${currencyId}`);
  return data;
};

export default {
  getNBURates,
  getAllCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
};
