import axios from 'axios';

import { configs } from '../constants';

const { CURRENCY_CODES } = configs;

const getNBURates = async () => {
  const { data } = await axios.get(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
  );
  return data.filter(({ cc }) => CURRENCY_CODES.includes(cc));
};

export { getNBURates };
