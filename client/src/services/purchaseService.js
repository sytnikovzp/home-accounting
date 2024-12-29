import api from '../api';

const getAllPurchases = async ({
  ago = 'allTime',
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = new URLSearchParams({
    ago,
    page,
    limit,
    sort,
    order,
  }).toString();
  try {
    const { data, headers } = await api.get(`/purchases?${params}`);
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

const getPurchaseByUuid = async (purchaseUuid) => {
  const { data } = await api.get(`/purchases/${purchaseUuid}`);
  return data;
};

const createPurchase = async (
  product,
  quantity,
  unitPrice,
  shop,
  measure,
  currency,
  date
) => {
  const { data } = await api.post('/purchases', {
    product,
    quantity,
    unitPrice,
    shop,
    measure,
    currency,
    date,
  });
  return data;
};

const updatePurchase = async (
  purchaseUuid,
  product,
  quantity,
  unitPrice,
  shop,
  measure,
  currency,
  date
) => {
  const { data } = await api.patch(`/purchases/${purchaseUuid}`, {
    product,
    quantity,
    unitPrice,
    shop,
    measure,
    currency,
    date,
  });
  return data;
};

const deletePurchase = async (purchaseUuid) => {
  const { data } = await api.delete(`/purchases/${purchaseUuid}`);
  return data;
};

export default {
  getAllPurchases,
  getPurchaseByUuid,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
