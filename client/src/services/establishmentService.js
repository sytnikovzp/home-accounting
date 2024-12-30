import api from '../api';

const getAllEstablishments = async ({
  status = 'approved',
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = new URLSearchParams({
    status,
    page,
    limit,
    sort,
    order,
  }).toString();
  try {
    const { data, headers } = await api.get(`/establishments?${params}`);
    const totalCount = parseInt(headers['x-total-count']);
    return {
      data,
      totalCount,
    };
  } catch (error) {
    console.error(error.response.data);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

const getEstablishmentByUuid = async (establishmentUuid) => {
  const { data } = await api.get(`/establishments/${establishmentUuid}`);
  return data;
};

const createEstablishment = async (title, description = '', url = '') => {
  const { data } = await api.post('/establishments', {
    title,
    description,
    url,
  });
  return data;
};

const updateEstablishment = async (
  establishmentUuid,
  title,
  description,
  url
) => {
  const { data } = await api.patch(`/establishments/${establishmentUuid}`, {
    title,
    description,
    url,
  });
  return data;
};

const updateEstablishmentLogo = async (
  establishmentUuid,
  establishmentLogo
) => {
  const formData = new FormData();
  formData.append('establishmentLogo', establishmentLogo);
  const { data } = await api.patch(
    `/establishments/update-logo/${establishmentUuid}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
};

const removeEstablishmentLogo = async (establishmentUuid) => {
  const { data } = await api.patch(
    `/establishments/delete-logo/${establishmentUuid}`,
    {
      logo: null,
    }
  );
  return data;
};

const deleteEstablishment = async (establishmentUuid) => {
  const { data } = await api.delete(`/establishments/${establishmentUuid}`);
  return data;
};

export default {
  getAllEstablishments,
  getEstablishmentByUuid,
  createEstablishment,
  updateEstablishment,
  updateEstablishmentLogo,
  removeEstablishmentLogo,
  deleteEstablishment,
};
