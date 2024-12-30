import api from '../api';

const getAllMeasures = async ({
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = new URLSearchParams({ page, limit, sort, order }).toString();
  try {
    const { data, headers } = await api.get(`/measures?${params}`);
    const totalCount = parseInt(headers['x-total-count']);
    return {
      data,
      totalCount,
    };
  } catch (error) {
    console.error(error.response.data);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

const getMeasureByUuid = async (measureUuid) => {
  const { data } = await api.get(`/measures/${measureUuid}`);
  return data;
};

const createMeasure = async (title, description = '') => {
  const { data } = await api.post('/measures', { title, description });
  return data;
};

const updateMeasure = async (measureUuid, title, description) => {
  const { data } = await api.patch(`/measures/${measureUuid}`, {
    title,
    description,
  });
  return data;
};

const deleteMeasure = async (measureUuid) => {
  const { data } = await api.delete(`/measures/${measureUuid}`);
  return data;
};

export default {
  getAllMeasures,
  getMeasureByUuid,
  createMeasure,
  updateMeasure,
  deleteMeasure,
};
