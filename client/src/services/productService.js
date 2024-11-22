import api from '../api/interceptor';

const getAllProducts = async ({
  status = 'approved',
  page = 1,
  limit = 10,
} = {}) => {
  const params = new URLSearchParams({
    status,
    _page: page,
    _limit: limit,
  }).toString();
  const response = await api.get(`/products?${params}`);
  return {
    data: response.data,
    total: response.headers['x-total-count'],
  };
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
  const response = await api.patch(`/products/${productId}/moderate`, {
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
