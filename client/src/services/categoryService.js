import api from '../api';

const getAllCategories = async (
  status = 'approved',
  page = 1,
  limit = 6,
  sort = 'id',
  order = 'asc'
) => {
  const params = new URLSearchParams(
    status,
    page,
    limit,
    sort,
    order
  ).toString();
  try {
    const { data, headers } = await api.get(`/categories?${params}`);
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

const getCategoryById = async (categoryId) => {
  const { data } = await api.get(`/categories/${categoryId}`);
  return data;
};

const createCategory = async (title) => {
  const { data } = await api.post('/categories', { title });
  return data;
};

const updateCategory = async (categoryId, title) => {
  const { data } = await api.patch(`/categories/${categoryId}`, { title });
  return data;
};

const reviewCategory = async (categoryId, status) => {
  const { data } = await api.patch(`/categories/moderate/${categoryId}`, {
    status,
  });
  return data;
};

const deleteCategory = async (categoryId) => {
  const { data } = await api.delete(`/categories/${categoryId}`);
  return data;
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  reviewCategory,
  deleteCategory,
};
