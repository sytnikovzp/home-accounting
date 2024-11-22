import api from '../api/interceptor';

const getAllCategories = async (status) => {
  const query = status ? `?status=${status}` : '';
  const response = await api.get(`/categories${query}`);
  return response.data;
};

const getCategoryById = async (categoryId) => {
  const response = await api.get(`/categories/${categoryId}`);
  return response.data;
};

const createCategory = async (title) => {
  const response = await api.post('/categories', { title });
  return response.data;
};

const updateCategory = async (categoryId, title) => {
  const response = await api.patch(`/categories/${categoryId}`, { title });
  return response.data;
};

const reviewCategory = async (categoryId, status) => {
  const response = await api.patch(`/categories/${categoryId}/moderate`, {
    status,
  });
  return response.data;
};

const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  reviewCategory,
  deleteCategory,
};
