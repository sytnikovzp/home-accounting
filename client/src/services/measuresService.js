import { requestHandler } from '../utils/sharedFunctions';

const getAllMeasures = async ({
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = { page, limit, sort, order };
  const response = await requestHandler({
    url: '/measures',
    method: 'GET',
    params,
  });
  return response;
};

const getMeasureByUuid = async (measureUuid) => {
  const response = await requestHandler({
    url: `/measures/${measureUuid}`,
    method: 'GET',
  });
  return response;
};

const createMeasure = async (title, description = '') => {
  const response = await requestHandler({
    url: '/measures',
    method: 'POST',
    data: { title, description },
  });
  return response;
};

const updateMeasure = async (measureUuid, title, description) => {
  const response = await requestHandler({
    url: `/measures/${measureUuid}`,
    method: 'PATCH',
    data: { title, description },
  });
  return response;
};

const deleteMeasure = async (measureUuid) => {
  const response = await requestHandler({
    url: `/measures/${measureUuid}`,
    method: 'DELETE',
  });
  return response;
};

export {
  createMeasure,
  deleteMeasure,
  getAllMeasures,
  getMeasureByUuid,
  updateMeasure,
};
