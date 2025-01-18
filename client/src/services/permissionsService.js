import { requestHandler } from '../utils/sharedFunctions';

const getAllPermissions = async () => {
  const response = await requestHandler({
    url: '/permissions',
    method: 'GET',
  });
  const data = Array.isArray(response) ? { data: response } : response;
  return data;
};

export { getAllPermissions };
