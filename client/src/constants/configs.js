const CURRENCY_CODES = ['USD', 'EUR', 'GBP', 'CAD', 'PLN'];

const DELAY_VISIBLE_PRELOADER = 350;

const SERVER = {
  HOST: import.meta.env.ACCOUNTING_SERVER_HOST,
  PORT: parseInt(import.meta.env.ACCOUNTING_SERVER_PORT),
};

const BASE_URL = `http://${SERVER.HOST}:${SERVER.PORT}/api`;

const NBU_STAT_URL = 'https://bank.gov.ua/NBUStatService/v1';

export { BASE_URL, CURRENCY_CODES, DELAY_VISIBLE_PRELOADER, NBU_STAT_URL };
