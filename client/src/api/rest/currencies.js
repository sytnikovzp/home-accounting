import axios from 'axios';

const getNBURates = async () => {
  const response = await axios.get(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
  );
  return response.data;
};

export default { getNBURates };
