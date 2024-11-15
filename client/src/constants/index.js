const SERVER_CONFIG = {
  HOST: import.meta.env.ACCOUNTING_SERVER_HOST,
  PORT: parseInt(import.meta.env.ACCOUNTING_SERVER_PORT),
};

const BASE_URL = `http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}/api/`;

const AUTH_FORM_INITIAL = {
  email: '',
  password: '',
};

const REGISTRATION_FORM_INITIAL = {
  fullName: '',
  email: '',
  password: '',
};

export {
  BASE_URL,
  AUTH_FORM_INITIAL,
  REGISTRATION_FORM_INITIAL,
};
