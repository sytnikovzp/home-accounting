import api from '../api';

const getAllPendingItems = async (
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc'
) => {
  const params = new URLSearchParams(
    page,
    limit,
    sort,
    order,
  ).toString();
  try {
    const { data, headers } = await api.get(`/moderation?${params}`);
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

const moderationCategory = async (categoryUuid, status) => {
  const { data } = await api.patch(`/moderation/categories/${categoryUuid}`, {
    status,
  });
  return data;
};

const moderationProduct = async (productUuid, status) => {
  const { data } = await api.patch(`/moderation/products/${productUuid}`, {
    status,
  });
  return data;
};

const moderationShop = async (shopUuid, status) => {
  const { data } = await api.patch(`/moderation/shops/${shopUuid}`, { status });
  return data;
};

export default {
  getAllPendingItems,
  moderationCategory,
  moderationProduct,
  moderationShop,
};
