const axios = require('axios');

const { badRequest } = require('../errors/generalErrors');

const getNBURates = async () => {
  const { data } = await axios.get(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
  );
  return data;
};

const convertToUAH = async (amount, currencyCode) => {
  const rates = await getNBURates();
  const currency = rates.find((rate) => rate.cc === currencyCode);
  if (!currency) {
    throw badRequest(`Курс для валюти ${currencyCode} не знайдено`);
  }
  const conversionRate = currency.rate;
  const amountInUAH = (amount * conversionRate).toFixed(2);
  return amountInUAH;
};

module.exports = {
  getNBURates,
  convertToUAH,
};
