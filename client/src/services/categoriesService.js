import { requestHandler } from '../utils/sharedFunctions';

const getAllCategories = async ({
  status = 'approved',
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = {
    status,
    page,
    limit,
    sort,
    order,
  };
  const response = await requestHandler({
    url: '/categories',
    method: 'GET',
    params,
  });
  return response;
};

const getCategoryByUuid = async (categoryUuid) => {
  const response = await requestHandler({
    url: `/categories/${categoryUuid}`,
    method: 'GET',
  });
  return response;
};

const createCategory = async (title) => {
  const response = await requestHandler({
    url: '/categories',
    method: 'POST',
    data: { title },
  });
  return response;
};

const updateCategory = async (categoryUuid, title) => {
  const response = await requestHandler({
    url: `/categories/${categoryUuid}`,
    method: 'PATCH',
    data: { title },
  });
  return response;
};

const deleteCategory = async (categoryUuid) => {
  const response = await requestHandler({
    url: `/categories/${categoryUuid}`,
    method: 'DELETE',
  });
  return response;
};

export {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryByUuid,
  updateCategory,
};
