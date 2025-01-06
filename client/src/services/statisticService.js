import api from '../api';

const getCostByCategories = async ({ ago = 'allTime' } = {}) => {
  const params = new URLSearchParams({ ago }).toString();
  try {
    const { data } = await api.get(`/statistics/categories?${params}`);
    return { data };
  } catch (error) {
    console.error(error.response.data);
    return {
      data: [],
    };
  }
};

const getCostByEstablishments = async ({ ago = 'allTime' } = {}) => {
  const params = new URLSearchParams({ ago }).toString();
  try {
    const { data } = await api.get(`/statistics/establishments?${params}`);
    return { data };
  } catch (error) {
    console.error(error.response.data);
    return {
      data: [],
    };
  }
};

const getCostByProducts = async ({ ago = 'allTime' } = {}) => {
  const params = new URLSearchParams({ ago }).toString();
  try {
    const { data } = await api.get(`/statistics/products?${params}`);
    return { data };
  } catch (error) {
    console.error(error.response.data);
    return {
      data: [],
    };
  }
};

export default {
  getCostByCategories,
  getCostByEstablishments,
  getCostByProducts,
};
