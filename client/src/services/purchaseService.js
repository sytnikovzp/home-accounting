import api from '../api';

const getAllPurchases = async (
  page = 1,
  limit = 6,
  sort = 'id',
  order = 'asc'
) => {
  const params = new URLSearchParams(page, limit, sort, order).toString();
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

const getPurchaseById = async (purchaseId) => {
  const { data } = await api.get(`/purchases/${purchaseId}`);
  return data;
};

const createPurchase = async (
  product,
  amount,
  price,
  shop,
  measure,
  currency
) => {
  const { data } = await api.post('/purchases', {
    product,
    amount,
    price,
    shop,
    measure,
    currency,
  });
  return data;
};

const updatePurchase = async (
  purchaseId,
  product,
  amount,
  price,
  shop,
  measure,
  currency
) => {
  const { data } = await api.patch(`/purchases/${purchaseId}`, {
    product,
    amount,
    price,
    shop,
    measure,
    currency,
  });
  return data;
};

const deletePurchase = async (purchaseId) => {
  const { data } = await api.delete(`/purchases/${purchaseId}`);
  return data;
};

export default {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
