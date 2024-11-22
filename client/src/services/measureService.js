import api from '../api/interceptor';

const getAllMeasures = async () => {
  const response = await api.get('/measures');
  return response.data;
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
