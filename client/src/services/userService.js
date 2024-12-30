import api from '../api';

const getAllUsers = async ({
  emailVerificationStatus = 'all',
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = new URLSearchParams({
    emailVerificationStatus,
    page,
    limit,
    sort,
    order,
  }).toString();
  try {
    const { data, headers } = await api.get(`/users?${params}`);
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

const getUserProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};

const getUserByUuid = async (userUuid) => {
  const { data } = await api.get(`/users/${userUuid}`);
  return data;
};

const updateUser = async (userUuid, fullName, email, role) => {
  const { data } = await api.patch(`/users/${userUuid}`, {
    fullName,
    email,
    role,
  });
  return data;
};

const changePassword = async (userUuid, newPassword, confirmNewPassword) => {
  const { data } = await api.patch(`/users/change-password/${userUuid}`, {
    newPassword,
    confirmNewPassword,
  });
  return data;
};

const updateUserPhoto = async (userUuid, userPhoto) => {
  const formData = new FormData();
  formData.append('userPhoto', userPhoto);
  const { data } = await api.patch(
    `/users/update-photo/${userUuid}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return data;
};

const removeUserPhoto = async (userUuid) => {
  const { data } = await api.patch(`/users/delete-photo/${userUuid}`, {
    photo: null,
  });
  return data;
};

const deleteUser = async (userUuid) => {
  const { data } = await api.delete(`/users/${userUuid}`);
  return data;
};

export default {
  getAllUsers,
  getUserProfile,
  getUserByUuid,
  updateUser,
  changePassword,
  updateUserPhoto,
  removeUserPhoto,
  deleteUser,
};
