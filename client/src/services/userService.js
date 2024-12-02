import api from '../api';

const getAllUsers = async ({ page = 1, limit = 6 } = {}) => {
  const params = new URLSearchParams({ page, limit }).toString();
  const response = await api.get(`/users?${params}`);
  const totalCount = parseInt(response.headers['x-total-count']);
  return {
    data: response.data,
    totalCount,
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
  const response = await api.patch(`/users/photo/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const removeUserPhoto = async (userId) => {
  const response = await api.patch(`/users/delete-photo/${userId}`, {
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
