import api from '../api';

const getAllMeasures = async (
  page = 1,
  limit = 6,
  sort = 'id',
  order = 'asc'
) => {
  const params = new URLSearchParams(page, limit, sort, order).toString();
  try {
    const { data, headers } = await api.get(`/measures?${params}`);
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

const getMeasureById = async (measureId) => {
  const { data } = await api.get(`/measures/${measureId}`);
  return data;
};

const createMeasure = async (title, description = '') => {
  const { data } = await api.post('/measures', { title, description });
  return data;
};

const updateMeasure = async (measureId, title, description) => {
  const { data } = await api.patch(`/measures/${measureId}`, {
    title,
    description,
  });
  return data;
};

const deleteMeasure = async (measureId) => {
  const { data } = await api.delete(`/measures/${measureId}`);
  return data;
};

export default {
  getAllMeasures,
  getMeasureById,
  createMeasure,
  updateMeasure,
  deleteMeasure,
};
