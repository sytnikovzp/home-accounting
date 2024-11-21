const SERVER_CONFIG = {
  HOST: import.meta.env.ACCOUNTING_SERVER_HOST,
  PORT: parseInt(import.meta.env.ACCOUNTING_SERVER_PORT),
};

const BASE_URL = `http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}/api/`;

const LOGIN_FORM_INITIAL = {
  email: '',
  password: '',
};

const REGISTRATION_FORM_INITIAL = {
  fullName: '',
  email: '',
  password: '',
};

const CURRENCY_CODES = ['USD', 'EUR', 'GBP'];

export {
  BASE_URL,
  LOGIN_FORM_INITIAL,
  REGISTRATION_FORM_INITIAL,
  CURRENCY_CODES,
};
