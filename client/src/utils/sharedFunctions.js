import { isValid, parse } from 'date-fns';
import { uk } from 'date-fns/locale/uk';

import { stylesHeaderUserAvatar } from '../styles';

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

const uuidPattern = /[\dA-Fa-f-]{36}/;

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

const groupByFirstLetter = (items, labelKey, valueKey) =>
  items.reduce((acc, item) => {
    const firstLetter = item[labelKey][0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push({
      label: item[labelKey],
      value: item[valueKey],
    });
    return acc;
  }, {});

const formatItems = (items, valueKey, labelKey) =>
  items.map((item) => ({
    label: item[labelKey],
    value: item[valueKey],
  }));

const parseDateString = (value, originalValue) => {
  if (typeof originalValue === 'string') {
    const parsedDate = parse(originalValue, 'dd MMMM yyyy', new Date(), {
      locale: uk,
    });
    return isValid(parsedDate) ? parsedDate : new Date('');
  }
  return originalValue;
};

export {
  formatItems,
  getAccessToken,
  groupByFirstLetter,
  parseDateString,
  removeAccessToken,
  saveAccessToken,
  stringAvatar,
  uuidPattern,
};
