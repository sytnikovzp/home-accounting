const SERVER = {
  HOST: import.meta.env.ACCOUNTING_SERVER_HOST,
  PORT: parseInt(import.meta.env.ACCOUNTING_SERVER_PORT),
};

const BASE_URL = `http://${SERVER.HOST}:${SERVER.PORT}/api/`;

const CURRENCY_CODES = ['USD', 'EUR', 'GBP'];

const DELAY_SHOW_PRELOADER = 300;

const CATEGORIES_SLICE_NAME = 'categories';

export {
  BASE_URL,
  CATEGORIES_SLICE_NAME,
  CURRENCY_CODES,
  DELAY_SHOW_PRELOADER,
};
