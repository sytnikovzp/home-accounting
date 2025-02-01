import { requestHandler } from '../utils/sharedFunctions';

const getAllPendingItems = async ({
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
}) => {
  const params = { page, limit, sort, order };
  const response = await requestHandler({
    url: '/moderation',
    method: 'GET',
    params,
  });
  return response;
};

const moderationCategory = async (categoryUuid, status) => {
  const response = await requestHandler({
    url: `/moderation/categories/${categoryUuid}`,
    method: 'PATCH',
    data: { status },
  });
  return response;
};

const moderationProduct = async (productUuid, status) => {
  const response = await requestHandler({
    url: `/moderation/products/${productUuid}`,
    method: 'PATCH',
    data: { status },
  });
  return response;
};

const moderationEstablishment = async (establishmentUuid, status) => {
  const response = await requestHandler({
    url: `/moderation/establishments/${establishmentUuid}`,
    method: 'PATCH',
    data: { status },
  });
  return response;
};

export {
  getAllPendingItems,
  moderationCategory,
  moderationEstablishment,
  moderationProduct,
};
