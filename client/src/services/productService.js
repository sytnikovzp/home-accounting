import { requestHandler } from '../utils/sharedFunctions';

const getAllProducts = async ({
  status = 'approved',
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = { status, page, limit, sort, order };
  const response = await requestHandler({
    url: '/products',
    method: 'GET',
    params,
  });
  return response;
};

const getProductByUuid = async (productUuid) => {
  const response = await requestHandler({
    url: `/products/${productUuid}`,
    method: 'GET',
  });
  return response;
};

const createProduct = async (title, category = '') => {
  const response = await requestHandler({
    url: '/products',
    method: 'POST',
    data: { title, category },
  });
  return response;
};

const updateProduct = async (productUuid, title, category) => {
  const response = await requestHandler({
    url: `/products/${productUuid}`,
    method: 'PATCH',
    data: { title, category },
  });
  return response;
};

const deleteProduct = async (productUuid) => {
  const response = await requestHandler({
    url: `/products/${productUuid}`,
    method: 'DELETE',
  });
  return response;
};

export default {
  getAllProducts,
  getProductByUuid,
  createProduct,
  updateProduct,
  deleteProduct,
};
