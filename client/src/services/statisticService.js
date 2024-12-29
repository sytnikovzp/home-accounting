import api from '../api';

const getCostByCategoryPerPeriod = async (category, ago = null) => {
  const params = new URLSearchParams(category, ...(ago && { ago })).toString();
  const { data } = await api.get(`/statistics/category-per-period?${params}`);
  return data;
};

const getCostByEstablishmentPerPeriod = async (establishment, ago = null) => {
  const params = new URLSearchParams(
    establishment,
    ...(ago && { ago })
  ).toString();
  const { data } = await api.get(
    `/statistics/establishment-per-period?${params}`
  );
  return data;
};

const getCostByCategories = async (ago = null) => {
  const params = new URLSearchParams(...(ago && { ago })).toString();
  const { data } = await api.get(`/statistics/categories?${params}`);
  return data;
};

const getCostByEstablishments = async (ago = null) => {
  const params = new URLSearchParams(...(ago && { ago })).toString();
  const { data } = await api.get(`/statistics/establishments?${params}`);
  return data;
};

export default {
  getCostByCategoryPerPeriod,
  getCostByEstablishmentPerPeriod,
  getCostByCategories,
  getCostByEstablishments,
};
