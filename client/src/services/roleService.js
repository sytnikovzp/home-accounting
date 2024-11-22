import api from '../api/interceptor';

const getAllPermissions = async ({ page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams({
    _page: page,
    _limit: limit,
  }).toString();

  const response = await api.get(`/roles/permissions?${params}`);
  return {
    data: response.data,
    total: response.headers['x-total-count'],
  };
};

const getAllRoles = async () => {
  const response = await api.get('/roles');
  return response.data;
};

const getRoleById = async (roleId) => {
  const response = await api.get(`/roles/${roleId}`);
  return response.data;
};

const createRole = async ({ title, description = '', permissions = [] }) => {
  const response = await api.post('/roles', {
    title,
    description,
    permissions,
  });
  return response.data;
};

const updateRole = async (roleId, { title, description, permissions }) => {
  const response = await api.patch(`/roles/${roleId}`, {
    title,
    description,
    permissions,
  });
  return response.data;
};

const deleteRole = async (roleId) => {
  const response = await api.delete(`/roles/${roleId}`);
  return response.data;
};

export default {
  getAllPermissions,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
