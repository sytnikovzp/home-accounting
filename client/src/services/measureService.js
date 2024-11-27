import api from '../api';

const getAllMeasures = async ({ page = 1, limit = 5 } = {}) => {
  const response = await api.get(`/measures?page=${page}&limit=${limit}`);
  const totalCount = parseInt(response.headers['x-total-count']);
  return {
    data: response.data,
    totalCount,
  };
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
