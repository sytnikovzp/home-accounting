import api from '../api';

const getAllPermissions = async ({ page = 1, limit = 6 } = {}) => {
  const params = new URLSearchParams({ page, limit }).toString();
  const response = await api.get(`/roles/permissions?${params}`);
  const totalCount = parseInt(response.headers['x-total-count']);
  return {
    data: response.data,
    totalCount,
  };
};

const getAllRoles = async ({ page = 1, limit = 6 } = {}) => {
  const params = new URLSearchParams({ page, limit }).toString();
  const response = await api.get(`/roles?${params}`);
  const totalCount = parseInt(response.headers['x-total-count']);
  return {
    data: response.data,
    totalCount,
  };
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
