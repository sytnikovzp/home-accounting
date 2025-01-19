import { requestHandler } from '../utils/sharedFunctions';

const getAllUsers = async ({
  emailVerificationStatus = 'all',
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = { emailVerificationStatus, page, limit, sort, order };
  const response = await requestHandler({
    url: '/users',
    method: 'GET',
    params,
  });
  return response;
};

const getUserProfile = async () => {
  const response = await requestHandler({
    url: '/users/profile',
    method: 'GET',
  });
  return response;
};

const getUserByUuid = async (userUuid) => {
  const response = await requestHandler({
    url: `/users/${userUuid}`,
    method: 'GET',
  });
  return response;
};

const updateUser = async (userUuid, fullName, email, role) => {
  const response = await requestHandler({
    url: `/users/${userUuid}`,
    method: 'PATCH',
    data: { fullName, email, role },
  });
  return response;
};

const changePassword = async (userUuid, newPassword, confirmNewPassword) => {
  const response = await requestHandler({
    url: `/users/${userUuid}/password`,
    method: 'PATCH',
    data: { newPassword, confirmNewPassword },
  });
  return response;
};

const updateUserPhoto = async (userUuid, userPhoto) => {
  const formData = new FormData();
  formData.append('userPhoto', userPhoto);
  const response = await requestHandler({
    url: `/users/${userUuid}/photo`,
    method: 'PATCH',
    data: formData,
  });
  return response;
};

const resetUserPhoto = async (userUuid) => {
  const response = await requestHandler({
    url: `/users/${userUuid}/photo/reset`,
    method: 'PATCH',
    data: { photo: null },
  });
  return response;
};

const deleteUser = async (userUuid) => {
  const response = await requestHandler({
    url: `/users/${userUuid}`,
    method: 'DELETE',
  });
  return response;
};

export {
  changePassword,
  deleteUser,
  getAllUsers,
  getUserByUuid,
  getUserProfile,
  resetUserPhoto,
  updateUser,
  updateUserPhoto,
};
