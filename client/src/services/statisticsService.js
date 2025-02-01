import { requestHandler } from '../utils/sharedFunctions';

const statisticsFetcher =
  (url) =>
  async ({ ago = 'allTime', creatorUuid }) => {
    const params = { ago };
    if (creatorUuid) {
      params.creatorUuid = creatorUuid;
    }
    const response = await requestHandler({
      url,
      method: 'GET',
      params,
    });
    return Array.isArray(response) ? { data: response } : response;
  };

const getCostByCategories = statisticsFetcher('/statistics/categories');

const getCostByEstablishments = statisticsFetcher('/statistics/establishments');

const getCostByProducts = statisticsFetcher('/statistics/products');

export { getCostByCategories, getCostByEstablishments, getCostByProducts };
