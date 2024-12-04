import api from '../api';

const getAllShops = async (
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
    const response = await api.get(`/shops?${params}`);
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

const getShopById = async (shopId) => {
  const response = await api.get(`/shops/${shopId}`);
  return response.data;
};

const createShop = async (title, description = '', url = '') => {
  const response = await api.post('/shops', { title, description, url });
  return response.data;
};

const updateShop = async (shopId, title, description, url) => {
  const response = await api.patch(`/shops/${shopId}`, {
    title,
    description,
    url,
  });
  return response.data;
};

const updateShopLogo = async (shopId, shopLogo) => {
  const formData = new FormData();
  formData.append('shopLogo', shopLogo);
  const response = await api.patch(`/shops/logo/${shopId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const removeShopLogo = async (shopId) => {
  const response = await api.patch(`/shops/delete-logo/${shopId}`, {
    logo: null,
  });
  return response.data;
};

const reviewShop = async (shopId, status) => {
  const response = await api.patch(`/shops/moderate/${shopId}`, { status });
  return response.data;
};

const deleteShop = async (shopId) => {
  const response = await api.delete(`/shops/${shopId}`);
  return response.data;
};

export default {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  updateShopLogo,
  removeShopLogo,
  reviewShop,
  deleteShop,
};
