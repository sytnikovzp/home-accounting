import api from '../api';

const getAllCategories = async ({
  status = 'approved',
  page = 1,
  limit = 6,
  sort = 'id',
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
    const response = await api.get(`/categories?${params}`);
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
  const response = await api.patch(`/categories/moderate/${categoryId}`, {
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
