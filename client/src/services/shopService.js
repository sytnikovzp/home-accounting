import api from '../api';

const getAllShops = async ({
  status = 'approved',
  page = 1,
  limit = 6,
} = {}) => {
  const params = new URLSearchParams({ status, page, limit }).toString();
  const response = await api.get(`/shops?${params}`);
  const totalCount = parseInt(response.headers['x-total-count']);
  return {
    data: response.data,
    totalCount,
  };
};

const getShopById = async (shopId) => {
  const response = await api.get(`/shops/${shopId}`);
  return response.data;
};

const createShop = async ({ title, description = '', url = '' }) => {
  const response = await api.post('/shops', { title, description, url });
  return response.data;
};

const updateShop = async (shopId, { title, description, url }) => {
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
  const response = await api.patch(`/shops/${shopId}/logo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const removeShopLogo = async (shopId) => {
  const response = await api.patch(`/shops/${shopId}/delete-logo`, {
    logo: null,
  });
  return response.data;
};

const reviewShop = async (shopId, status) => {
  const response = await api.patch(`/shops/${shopId}/moderate`, { status });
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
