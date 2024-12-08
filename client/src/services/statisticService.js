import api from '../api';

const getCostByCategoryPerPeriod = async (category, ago = null) => {
  const params = new URLSearchParams(category, ...(ago && { ago })).toString();
  const { data } = await api.get(`/statistics/category-per-period?${params}`);
  return data;
};

const getCostByShopPerPeriod = async (shop, ago = null) => {
  const params = new URLSearchParams(shop, ...(ago && { ago })).toString();
  const { data } = await api.get(`/statistics/shop-per-period?${params}`);
  return data;
};

const getCostByCategories = async (ago = null) => {
  const params = new URLSearchParams(...(ago && { ago })).toString();
  const { data } = await api.get(`/statistics/categories?${params}`);
  return data;
};

const getCostByShops = async (ago = null) => {
  const params = new URLSearchParams(...(ago && { ago })).toString();
  const { data } = await api.get(`/statistics/shops?${params}`);
  return data;
};

export default {
  getCostByCategoryPerPeriod,
  getCostByShopPerPeriod,
  getCostByCategories,
  getCostByShops,
};
