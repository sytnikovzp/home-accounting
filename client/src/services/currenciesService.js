import { requestHandler } from '../utils/sharedFunctions';

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

export {
  createCurrency,
  deleteCurrency,
  getAllCurrencies,
  getCurrencyByUuid,
  updateCurrency,
};
