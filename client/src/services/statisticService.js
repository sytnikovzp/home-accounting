import api from '../api/interceptor';

const getCostByCategoryPerPeriod = async ({ category, ago = null }) => {
  const params = new URLSearchParams({
    category,
    ...(ago && { ago }),
  }).toString();

  const response = await api.get(`/statistics/category-per-period?${params}`);
  return response.data;
};

const getCostByShopPerPeriod = async ({ shop, ago = null }) => {
  const params = new URLSearchParams({ shop, ...(ago && { ago }) }).toString();

  const response = await api.get(`/statistics/shop-per-period?${params}`);
  return response.data;
};

const getCostByCategories = async ({ ago = null } = {}) => {
  const params = new URLSearchParams({ ...(ago && { ago }) }).toString();

  const response = await api.get(`/statistics/categories?${params}`);
  return response.data;
};

const getCostByShops = async ({ ago = null } = {}) => {
  const params = new URLSearchParams({ ...(ago && { ago }) }).toString();

  const response = await api.get(`/statistics/shops?${params}`);
  return response.data;
};

export default {
  getCostByCategoryPerPeriod,
  getCostByShopPerPeriod,
  getCostByCategories,
  getCostByShops,
};
