import { requestHandler } from '../utils/sharedFunctions';

const createStatisticsFetcher =
  (url) =>
  async ({ ago = 'allTime', creatorUuid } = {}) => {
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

export default {
  getCostByCategories: createStatisticsFetcher('/statistics/categories'),
  getCostByEstablishments: createStatisticsFetcher(
    '/statistics/establishments'
  ),
  getCostByProducts: createStatisticsFetcher('/statistics/products'),
};
