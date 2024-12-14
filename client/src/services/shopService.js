import api from '../api';

const getAllShops = async (
  status = 'approved',
  page = 1,
  limit = 6,
  sort = 'uuid',
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

const getShopByUuid = async (shopUuid) => {
  const { data } = await api.get(`/shops/${shopUuid}`);
  return data;
};

const createShop = async (title, description = '', url = '') => {
  const { data } = await api.post('/shops', { title, description, url });
  return data;
};

const updateShop = async (shopUuid, title, description, url) => {
  const { data } = await api.patch(`/shops/${shopUuid}`, {
    title,
    description,
    url,
  });
  return data;
};

const updateShopLogo = async (shopUuid, shopLogo) => {
  const formData = new FormData();
  formData.append('shopLogo', shopLogo);
  const { data } = await api.patch(`/shops/logo/${shopUuid}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const removeShopLogo = async (shopUuid) => {
  const { data } = await api.patch(`/shops/delete-logo/${shopUuid}`, {
    logo: null,
  });
  return data;
};

const moderationShop = async (shopUuid, status) => {
  const { data } = await api.patch(`/shops/moderation/${shopUuid}`, { status });
  return data;
};

const deleteShop = async (shopUuid) => {
  const { data } = await api.delete(`/shops/${shopUuid}`);
  return data;
};

export default {
  getAllShops,
  getShopByUuid,
  createShop,
  updateShop,
  updateShopLogo,
  removeShopLogo,
  moderationShop,
  deleteShop,
};
