import api from '../api';

const getAllProducts = async ({
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

const getProductByUuid = async (productUuid) => {
  const { data } = await api.get(`/products/${productUuid}`);
  return data;
};

const createProduct = async (title, category = '') => {
  const { data } = await api.post('/products', { title, category });
  return data;
};

const updateProduct = async (productUuid, title, category) => {
  const { data } = await api.patch(`/products/${productUuid}`, {
    title,
    category,
  });
  return data;
};

const deleteProduct = async (productUuid) => {
  const { data } = await api.delete(`/products/${productUuid}`);
  return data;
};

export default {
  getAllProducts,
  getProductByUuid,
  createProduct,
  updateProduct,
  deleteProduct,
};
