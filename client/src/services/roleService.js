import api from '../api';

const getAllPermissions = async () => {
  try {
    const { data } = await api.get(`/roles/permissions`);
    return {
      data,
    };
  } catch (error) {
    console.error(error.response.data.errors[0].title);
    return {
      data: [],
    };
  }
};

const getAllRoles = async ({
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = new URLSearchParams({ page, limit, sort, order }).toString();
  try {
    const { data, headers } = await api.get(`/roles?${params}`);
    const totalCount = parseInt(headers['x-total-count']);
    return {
      data,
      totalCount,
    };
  } catch (error) {
    console.error(error.response.data.errors[0].title);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

const getRoleByUuid = async (roleUuid) => {
  const { data } = await api.get(`/roles/${roleUuid}`);
  return data;
};

const createRole = async (title, description = '', permissions = []) => {
  const { data } = await api.post('/roles', {
    title,
    description,
    permissions,
  });
  return data;
};

const updateRole = async (roleUuid, title, description, permissions) => {
  const { data } = await api.patch(`/roles/${roleUuid}`, {
    title,
    description,
    permissions,
  });
  return data;
};

const deleteRole = async (roleUuid) => {
  const { data } = await api.delete(`/roles/${roleUuid}`);
  return data;
};

export default {
  getAllPermissions,
  getAllRoles,
  getRoleByUuid,
  createRole,
  updateRole,
  deleteRole,
};
