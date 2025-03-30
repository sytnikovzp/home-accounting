const SERVER_HOST = import.meta.env.ACCOUNTING_SERVER_HOST;
const SERVER_PORT = parseInt(import.meta.env.ACCOUNTING_SERVER_PORT);

export const API_CONFIG = {
  BASE_URL: `http://${SERVER_HOST}:${SERVER_PORT}/api`,
  NBU_STAT_URL: 'https://bank.gov.ua/NBUStatService/v1',
};
