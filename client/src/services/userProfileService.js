import { requestHandler } from '../utils/sharedFunctions';

const getUserProfile = async () => {
  const response = await requestHandler({
    url: '/profile',
    method: 'GET',
  });
  return response;
};

const changePassword = async (newPassword, confirmNewPassword) => {
  const response = await requestHandler({
    url: `/profile/password`,
    method: 'PATCH',
    data: { newPassword, confirmNewPassword },
  });
  return response;
};

const updateUser = async (fullName, email, role) => {
  const response = await requestHandler({
    url: '/profile',
    method: 'PATCH',
    data: { fullName, email, role },
  });
  return response;
};

const changeUserPhoto = async (userPhoto) => {
  const formData = new FormData();
  formData.append('userPhoto', userPhoto);
  const response = await requestHandler({
    url: `/profile/photo`,
    method: 'PATCH',
    data: formData,
  });
  return response;
};

const resetUserPhoto = async () => {
  const response = await requestHandler({
    url: `/profile/photo`,
    method: 'PATCH',
    data: { photo: null },
  });
  return response;
};

const deleteUser = async () => {
  const response = await requestHandler({
    url: '/profile',
    method: 'DELETE',
  });
  return response;
};

export {
  changePassword,
  changeUserPhoto,
  deleteUser,
  getUserProfile,
  resetUserPhoto,
  updateUser,
};
