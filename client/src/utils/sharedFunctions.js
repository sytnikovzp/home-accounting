const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const saveAccessToken = (token) => {
  return localStorage.setItem('accessToken', token);
};

const removeAccessToken = () => {
  return localStorage.removeItem('accessToken');
};

export { getAccessToken, saveAccessToken, removeAccessToken };
