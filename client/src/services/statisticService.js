import api from '../api';

const getCostByCategories = async ({ ago = 'allTime', creatorUuid } = {}) => {
  const params = new URLSearchParams({ ago });
  if (creatorUuid) {
    params.append('creatorUuid', creatorUuid);
  }
  try {
    const { data } = await api.get(
      `/statistics/categories?${params.toString()}`
    );
    return { data };
  } catch (error) {
    console.error(error.response.data);
    return {
      data: [],
    };
  }
};

const getCostByEstablishments = async ({
  ago = 'allTime',
  creatorUuid,
} = {}) => {
  const params = new URLSearchParams({ ago });
  if (creatorUuid) {
    params.append('creatorUuid', creatorUuid);
  }
  try {
    const { data } = await api.get(
      `/statistics/establishments?${params.toString()}`
    );
    return { data };
  } catch (error) {
    console.error(error.response.data);
    return {
      data: [],
    };
  }
};

const getCostByProducts = async ({ ago = 'allTime', creatorUuid } = {}) => {
  const params = new URLSearchParams({ ago });
  if (creatorUuid) {
    params.append('creatorUuid', creatorUuid);
  }
  try {
    const { data } = await api.get(`/statistics/products?${params.toString()}`);
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
