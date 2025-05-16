import { stylesHeaderUserAvatar } from '../styles';

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + hash * 31;
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    let value = Math.floor((hash / Math.pow(256, i)) % 256);
    value = Math.max(80, Math.min(200, value));
    color += value.toString(16).padStart(2, '0');
  }
  return color;
};

const stringAvatar = (fullName) => {
  if (!fullName || typeof fullName !== 'string') {
    return {
      children: '',
      sx: {
        ...stylesHeaderUserAvatar,
        backgroundColor: stringToColor(''),
      },
    };
  }
  const words = fullName.trim().split(' ');
  const firstLetter = words[0] ? words[0][0].toUpperCase() : '';
  const secondLetter = words[1] ? words[1][0].toUpperCase() : '';
  return {
    children: `${firstLetter}${secondLetter}`,
    sx: {
      ...stylesHeaderUserAvatar,
      backgroundColor: stringToColor(fullName),
    },
  };
};

export { stringAvatar, stringToColor };
