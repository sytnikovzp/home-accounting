const getAccessToken = () => {
  const token = localStorage.getItem('homeAccountingToken');
  if (token === 'undefined') {
    localStorage.removeItem('homeAccountingToken');
    return null;
  }
  return token;
};

const saveAccessToken = (token) =>
  localStorage.setItem('homeAccountingToken', token);

const removeAccessToken = () => localStorage.removeItem('homeAccountingToken');

export { getAccessToken, removeAccessToken, saveAccessToken };
