import axios from 'axios';
// ==============================================================
import api from '../api';

const getNBURates = async () => {
  const { data } = await axios.get(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
  );
  return data;
};

const getAllCurrencies = async ({
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = new URLSearchParams({ page, limit, sort, order }).toString();
  try {
    const { data, headers } = await api.get(`/currencies?${params}`);
    const totalCount = parseInt(headers['x-total-count']);
    return {
      data,
      totalCount,
    };
  } catch (error) {
    console.error(error.response.data);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

const getCurrencyByUuid = async (currencyUuid) => {
  const { data } = await api.get(`/currencies/${currencyUuid}`);
  return data;
};

const createCurrency = async (title, code) => {
  const { data } = await api.post('/currencies', {
    title,
    code,
  });
  return data;
};

const updateCurrency = async (currencyUuid, title, code) => {
  const { data } = await api.patch(`/currencies/${currencyUuid}`, {
    title,
    code,
  });
  return data;
};

const deleteCurrency = async (currencyUuid) => {
  const { data } = await api.delete(`/currencies/${currencyUuid}`);
  return data;
};

export default {
  getNBURates,
  getAllCurrencies,
  getCurrencyByUuid,
  createCurrency,
  updateCurrency,
  deleteCurrency,
};
