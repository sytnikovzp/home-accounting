const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const setAccessToken = (token) => {
  return localStorage.setItem('accessToken', token);
};

const clearAccessToken = () => {
  return localStorage.removeItem('accessToken');
};

export { getAccessToken, setAccessToken, clearAccessToken };
