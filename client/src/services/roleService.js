import api from '../api';

const getAllPermissions = async (
  page = 1,
  limit = 6,
  sort = 'id',
  order = 'asc'
) => {
  const params = new URLSearchParams(page, limit, sort, order).toString();
  try {
    const { data, headers } = await api.get(`/roles/permissions?${params}`);
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

const getAllRoles = async (page = 1, limit = 6, sort = 'id', order = 'asc') => {
  const params = new URLSearchParams(page, limit, sort, order).toString();
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

const getRoleById = async (roleId) => {
  const { data } = await api.get(`/roles/${roleId}`);
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

const updateRole = async (roleId, title, description, permissions) => {
  const { data } = await api.patch(`/roles/${roleId}`, {
    title,
    description,
    permissions,
  });
  return data;
};

const deleteRole = async (roleId) => {
  const { data } = await api.delete(`/roles/${roleId}`);
  return data;
};

export default {
  getAllPermissions,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
