import api from '../api';

const getAllUsers = async ({ page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams({ page, limit }).toString();
  const response = await api.get(`/users?${params}`);
  return {
    data: response.data,
    total: response.headers['x-total-count'],
  };
};

const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

const updateUser = async (userId, { fullName, password, role }) => {
  const response = await api.patch(`/users/${userId}`, {
    fullName,
    password,
    role,
  });
  return response.data;
};

const updateUserPhoto = async (userId, userPhoto) => {
  const formData = new FormData();
  formData.append('userPhoto', userPhoto);
  const response = await api.patch(`/users/${userId}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const removeUserPhoto = async (userId) => {
  const response = await api.patch(`/users/${userId}/delete-photo`, {
    photo: null,
  });
  return response.data;
};

const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export default {
  getAllUsers,
  getUserProfile,
  getUserById,
  updateUser,
  updateUserPhoto,
  removeUserPhoto,
  deleteUser,
};
