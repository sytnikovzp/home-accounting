import { requestHandler } from '../utils/sharedFunctions';

const getAllPermissions = async () => {
  const response = await requestHandler({
    url: '/roles/permissions',
    method: 'GET',
  });
  const data = Array.isArray(response) ? { data: response } : response;
  return data;
};

const getAllRoles = async ({
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = { page, limit, sort, order };
  const response = await requestHandler({
    url: '/roles',
    method: 'GET',
    params,
  });
  return response;
};

const getRoleByUuid = async (roleUuid) => {
  const response = await requestHandler({
    url: `/roles/${roleUuid}`,
    method: 'GET',
  });
  return response;
};

const createRole = async (title, description = '', permissions = []) => {
  const response = await requestHandler({
    url: '/roles',
    method: 'POST',
    data: { title, description, permissions },
  });
  return response;
};

const updateRole = async (roleUuid, title, description, permissions) => {
  const response = await requestHandler({
    url: `/roles/${roleUuid}`,
    method: 'PATCH',
    data: { title, description, permissions },
  });
  return response;
};

const deleteRole = async (roleUuid) => {
  const response = await requestHandler({
    url: `/roles/${roleUuid}`,
    method: 'DELETE',
  });
  return response;
};

export default {
  getAllPermissions,
  getAllRoles,
  getRoleByUuid,
  createRole,
  updateRole,
  deleteRole,
};
