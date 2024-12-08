import api from '../api';

const getAllProducts = async (
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
    const { data, headers } = await api.get(`/products?${params}`);
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

const getProductById = async (productId) => {
  const { data } = await api.get(`/products/${productId}`);
  return data;
};

const createProduct = async (title, category = '') => {
  const { data } = await api.post('/products', { title, category });
  return data;
};

const updateProduct = async (productId, title, category) => {
  const { data } = await api.patch(`/products/${productId}`, {
    title,
    category,
  });
  return data;
};

const reviewProduct = async (productId, status) => {
  const { data } = await api.patch(`/products/moderate/${productId}`, {
    status,
  });
  return data;
};

const deleteProduct = async (productId) => {
  const { data } = await api.delete(`/products/${productId}`);
  return data;
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  reviewProduct,
  deleteProduct,
};
