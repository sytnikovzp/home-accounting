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
    const { data, headers } = await api.get(`/shops?${params}`);
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

const getShopById = async (shopId) => {
  const { data } = await api.get(`/shops/${shopId}`);
  return data;
};

const createShop = async (title, description = '', url = '') => {
  const { data } = await api.post('/shops', { title, description, url });
  return data;
};

const updateShop = async (shopId, title, description, url) => {
  const { data } = await api.patch(`/shops/${shopId}`, {
    title,
    description,
    url,
  });
  return data;
};

const updateShopLogo = async (shopId, shopLogo) => {
  const formData = new FormData();
  formData.append('shopLogo', shopLogo);
  const { data } = await api.patch(`/shops/logo/${shopId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const removeShopLogo = async (shopId) => {
  const { data } = await api.patch(`/shops/delete-logo/${shopId}`, {
    logo: null,
  });
  return data;
};

const reviewShop = async (shopId, status) => {
  const { data } = await api.patch(`/shops/moderate/${shopId}`, { status });
  return data;
};

const deleteShop = async (shopId) => {
  const { data } = await api.delete(`/shops/${shopId}`);
  return data;
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
