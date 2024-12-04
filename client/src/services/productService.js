import api from '../api';

const getAllProducts = async ({
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
    const response = await api.get(`/products?${params}`);
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

const getProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

const createProduct = async (title, category = '') => {
  const response = await api.post('/products', { title, category });
  return response.data;
};

const updateProduct = async (productId, { title, category }) => {
  const response = await api.patch(`/products/${productId}`, {
    title,
    category,
  });
  return response.data;
};

const reviewProduct = async (productId, status) => {
  const response = await api.patch(`/products/moderate/${productId}`, {
    status,
  });
  return response.data;
};

const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  reviewProduct,
  deleteProduct,
};
