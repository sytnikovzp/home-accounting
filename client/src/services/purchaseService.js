import api from '../api';

const getAllPurchases = async ({ page = 1, limit = 6 } = {}) => {
  const params = new URLSearchParams({ page, limit }).toString();
  const response = await api.get(`/purchases?${params}`);
  const totalCount = parseInt(response.headers['x-total-count']);
  return {
    data: response.data,
    totalCount,
  };
};

const getPurchaseById = async (purchaseId) => {
  const response = await api.get(`/purchases/${purchaseId}`);
  return response.data;
};

const createPurchase = async ({
  product,
  amount,
  price,
  shop,
  measure,
  currency,
}) => {
  const response = await api.post('/purchases', {
    product,
    amount,
    price,
    shop,
    measure,
    currency,
  });
  return response.data;
};

const updatePurchase = async (
  purchaseId,
  { product, amount, price, shop, measure, currency }
) => {
  const response = await api.patch(`/purchases/${purchaseId}`, {
    product,
    amount,
    price,
    shop,
    measure,
    currency,
  });
  return response.data;
};

const deletePurchase = async (purchaseId) => {
  const response = await api.delete(`/purchases/${purchaseId}`);
  return response.data;
};

export default {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
