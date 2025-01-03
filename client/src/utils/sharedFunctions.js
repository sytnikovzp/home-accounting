import { stylesHeaderUserAvatar } from '../styles/theme';

const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const saveAccessToken = (token) => {
  return localStorage.setItem('accessToken', token);
};

const removeAccessToken = () => {
  return localStorage.removeItem('accessToken');
};

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const stringAvatar = (fullName) => {
  const words = fullName.trim().split(' ');
  const firstLetter = words[0] ? words[0][0].toUpperCase() : '';
  const secondLetter = words[1] ? words[1][0].toUpperCase() : '';
  return {
    sx: {
      ...stylesHeaderUserAvatar,
      backgroundColor: stringToColor(fullName),
    },
    children: `${firstLetter}${secondLetter}`,
  };
};

export { getAccessToken, saveAccessToken, removeAccessToken, stringAvatar };
