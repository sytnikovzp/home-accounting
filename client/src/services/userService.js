import api from '../api';

const getAllUsers = async ({
  page = 1,
  limit = 6,
  sort = 'id',
  order = 'asc',
} = {}) => {
  const params = new URLSearchParams({
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
    console.error(error.response.data.errors[0].title);
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

const getUserById = async (userId) => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

const updateUser = async (userId, fullName, password, role) => {
  const { data } = await api.patch(`/users/${userId}`, {
    fullName,
    password,
    role,
  });
  return data;
};

const updateUserPhoto = async (userId, userPhoto) => {
  const formData = new FormData();
  formData.append('userPhoto', userPhoto);
  const { data } = await api.patch(`/users/photo/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

const removeUserPhoto = async (userId) => {
  const { data } = await api.patch(`/users/delete-photo/${userId}`, {
    photo: null,
  });
  return data;
};

const deleteUser = async (userId) => {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
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
