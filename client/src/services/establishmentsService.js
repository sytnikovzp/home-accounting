import { requestHandler } from '../utils/sharedFunctions';

const getAllEstablishments = async ({
  status = 'approved',
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = { status, page, limit, sort, order };
  const response = await requestHandler({
    url: '/establishments',
    method: 'GET',
    params,
  });
  return response;
};

const getEstablishmentByUuid = async (establishmentUuid) => {
  const response = await requestHandler({
    url: `/establishments/${establishmentUuid}`,
    method: 'GET',
  });
  return response;
};

const createEstablishment = async (title, description = '', url = '') => {
  const response = await requestHandler({
    url: '/establishments',
    method: 'POST',
    data: { title, description, url },
  });
  return response;
};

const updateEstablishment = async (
  establishmentUuid,
  title,
  description,
  url
) => {
  const response = await requestHandler({
    url: `/establishments/${establishmentUuid}`,
    method: 'PATCH',
    data: { title, description, url },
  });
  return response;
};

const updateEstablishmentLogo = async (
  establishmentUuid,
  establishmentLogo
) => {
  const formData = new FormData();
  formData.append('establishmentLogo', establishmentLogo);
  const response = await requestHandler({
    url: `/establishments/${establishmentUuid}/logo`,
    method: 'PATCH',
    data: formData,
  });
  return response;
};

const resetEstablishmentLogo = async (establishmentUuid) => {
  const response = await requestHandler({
    url: `/establishments/${establishmentUuid}/logo/reset`,
    method: 'PATCH',
    data: { logo: null },
  });
  return response;
};

const deleteEstablishment = async (establishmentUuid) => {
  const response = await requestHandler({
    url: `/establishments/${establishmentUuid}`,
    method: 'DELETE',
  });
  return response;
};

export {
  createEstablishment,
  deleteEstablishment,
  getAllEstablishments,
  getEstablishmentByUuid,
  resetEstablishmentLogo,
  updateEstablishment,
  updateEstablishmentLogo,
};
