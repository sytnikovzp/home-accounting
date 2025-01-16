import axios from 'axios';

import { CURRENCY_CODES } from '../constants/index';

const getNBURates = async () => {
  const { data } = await axios.get(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
  );
  return data.filter(({ cc }) => CURRENCY_CODES.includes(cc));
};

export { getNBURates };
