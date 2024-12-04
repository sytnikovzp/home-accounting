import api from '../api';

const getAllMeasures = async ({
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
    const response = await api.get(`/measures?${params}`);
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

const getMeasureById = async (measureId) => {
  const response = await api.get(`/measures/${measureId}`);
  return response.data;
};

const createMeasure = async (title, description = '') => {
  const response = await api.post('/measures', { title, description });
  return response.data;
};

const updateMeasure = async (measureId, title, description) => {
  const response = await api.patch(`/measures/${measureId}`, {
    title,
    description,
  });
  return response.data;
};

const deleteMeasure = async (measureId) => {
  const response = await api.delete(`/measures/${measureId}`);
  return response.data;
};

export default {
  getAllMeasures,
  getMeasureById,
  createMeasure,
  updateMeasure,
  deleteMeasure,
};
