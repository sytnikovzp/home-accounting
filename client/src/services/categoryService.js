import api from '../api';

const getAllCategories = async ({
  status = 'approved',
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = new URLSearchParams({
    status,
    page,
    limit,
    sort,
    order,
  }).toString();
  try {
    const { data, headers } = await api.get(`/categories?${params}`);
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

const getCategoryByUuid = async (categoryUuid) => {
  const { data } = await api.get(`/categories/${categoryUuid}`);
  return data;
};

const createCategory = async (title) => {
  const { data } = await api.post('/categories', { title });
  return data;
};

const updateCategory = async (categoryUuid, title) => {
  const { data } = await api.patch(`/categories/${categoryUuid}`, { title });
  return data;
};

const deleteCategory = async (categoryUuid) => {
  const { data } = await api.delete(`/categories/${categoryUuid}`);
  return data;
};

export default {
  getAllCategories,
  getCategoryByUuid,
  createCategory,
  updateCategory,
  deleteCategory,
};
