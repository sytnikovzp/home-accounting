import api from '../interceptor';

const fetchUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export default { fetchUserProfile };
