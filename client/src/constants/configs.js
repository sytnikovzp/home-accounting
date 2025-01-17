const CURRENCY_CODES = ['USD', 'EUR', 'GBP'];

const DELAY_SHOW_PRELOADER = 350;

const SERVER = {
  HOST: import.meta.env.ACCOUNTING_SERVER_HOST,
  PORT: parseInt(import.meta.env.ACCOUNTING_SERVER_PORT),
};

const BASE_URL = `http://${SERVER.HOST}:${SERVER.PORT}/api/`;

export { BASE_URL, CURRENCY_CODES, DELAY_SHOW_PRELOADER };
