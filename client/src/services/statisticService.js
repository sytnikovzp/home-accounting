import { requestHandler } from '../utils/sharedFunctions';

const getCostByCategories = async ({ ago = 'allTime', creatorUuid } = {}) => {
  const params = { ago };
  if (creatorUuid) {
    params.creatorUuid = creatorUuid;
  }
  const response = await requestHandler({
    url: '/statistics/categories',
    method: 'GET',
    params,
  });
  const data = Array.isArray(response) ? { data: response } : response;
  return data;
};

const getCostByEstablishments = async ({
  ago = 'allTime',
  creatorUuid,
} = {}) => {
  const params = { ago };
  if (creatorUuid) {
    params.creatorUuid = creatorUuid;
  }
  const response = await requestHandler({
    url: '/statistics/establishments',
    method: 'GET',
    params,
  });
  const data = Array.isArray(response) ? { data: response } : response;
  return data;
};

const getCostByProducts = async ({ ago = 'allTime', creatorUuid } = {}) => {
  const params = { ago };
  if (creatorUuid) {
    params.creatorUuid = creatorUuid;
  }
  const response = await requestHandler({
    url: '/statistics/products',
    method: 'GET',
    params,
  });
  const data = Array.isArray(response) ? { data: response } : response;
  return data;
};

export default {
  getCostByCategories,
  getCostByEstablishments,
  getCostByProducts,
};
