import axios from 'axios';

import { requestHandler } from '../utils/sharedFunctions';

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
  const params = { page, limit, sort, order };
  const response = await requestHandler({
    url: '/currencies',
    method: 'GET',
    params,
  });
  return response;
};

const getCurrencyByUuid = async (currencyUuid) => {
  const response = await requestHandler({
    url: `/currencies/${currencyUuid}`,
    method: 'GET',
  });
  return response;
};

const createCurrency = async (title, code) => {
  const response = await requestHandler({
    url: '/currencies',
    method: 'POST',
    data: { title, code },
  });
  return response;
};

const updateCurrency = async (currencyUuid, title, code) => {
  const response = await requestHandler({
    url: `/currencies/${currencyUuid}`,
    method: 'PATCH',
    data: { title, code },
  });
  return response;
};

const deleteCurrency = async (currencyUuid) => {
  const response = await requestHandler({
    url: `/currencies/${currencyUuid}`,
    method: 'DELETE',
  });
  return response;
};

export default {
  getNBURates,
  getAllCurrencies,
  getCurrencyByUuid,
  createCurrency,
  updateCurrency,
  deleteCurrency,
};
