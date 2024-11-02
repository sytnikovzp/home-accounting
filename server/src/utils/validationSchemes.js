const yup = require('yup');

const TITLE_NAME_SCHEME = yup
  .string('Це поле має бути рядком')
  .trim('Введені дані не можуть містити пробіли на початку або в кінці')
  .min(2, 'Введені дані мають бути не менше 2 символів')
  .max(100, 'Введені дані не можуть перевищувати 100 символів')
  .required('Це поле є обовʼязкове');

const PASSWORD_SCHEME = yup
  .string('Це поле має бути рядком')
  .trim('Введені дані не можуть містити пробіли на початку або в кінці')
  .min(8, 'Введені дані мають бути не менше 8 символів')
  .max(20, 'Введені дані не можуть перевищувати 20 символів');

const STRING_NULLABLE_SCHEME = yup.string('Це поле має бути рядком').nullable();

const NUMBER_SCHEME = yup
  .number('Це поле має бути числом')
  .required('Це поле є обовʼязкове');

const ID_SCHEME = yup
  .number('Це поле має бути числом')
  .integer('Це поле має бути цілим числом')
  .positive('Це поле має бути більше 0');

const URL_RESOURCE_SCHEME = yup
  .string('Це поле має бути рядком')
  .url('Введіть коректний URL')
  .nullable();

const EMAIL_VALIDATION_SCHEME = yup
  .string('Це поле має бути рядком')
  .email('Введіть коректний e-mail');

const PAGINATION_SCHEME = yup.object().shape({
  limit: yup.number().min(1).max(500).required(),
  offset: yup.number().min(0).required(),
});

// ==============================================================

const REGISTRATION_VALIDATION_SCHEME = yup.object().shape({
  fullName: TITLE_NAME_SCHEME,
  email: EMAIL_VALIDATION_SCHEME.required('E-mail є обовʼязковим полем'),
  password: PASSWORD_SCHEME.required('Пароль є обовʼязковим полем'),
});

const UPDATE_USER_VALIDATION_SCHEME = yup.object().shape({
  fullName: STRING_NULLABLE_SCHEME,
  email: EMAIL_VALIDATION_SCHEME.nullable(),
  password: PASSWORD_SCHEME.nullable(),
  role: STRING_NULLABLE_SCHEME,
});

const AUTH_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_VALIDATION_SCHEME.required('E-mail є обовʼязковим полем'),
  password: PASSWORD_SCHEME.required('Пароль є обовʼязковим полем'),
});

const ITEM_VALIDATION_SCHEME = yup.object().shape({
  product: TITLE_NAME_SCHEME,
  amount: NUMBER_SCHEME,
  price: NUMBER_SCHEME,
  shop: TITLE_NAME_SCHEME,
  measure: TITLE_NAME_SCHEME,
  currency: TITLE_NAME_SCHEME,
});

const PRODUCT_VALIDATION_SCHEME = yup.object().shape({
  title: TITLE_NAME_SCHEME,
  description: STRING_NULLABLE_SCHEME,
  categoryId: ID_SCHEME,
});

const CATEGORY_VALIDATION_SCHEME = yup.object().shape({
  title: TITLE_NAME_SCHEME,
  description: STRING_NULLABLE_SCHEME,
});

const SHOP_VALIDATION_SCHEME = yup.object().shape({
  title: TITLE_NAME_SCHEME,
  description: STRING_NULLABLE_SCHEME,
  url: URL_RESOURCE_SCHEME,
  image: STRING_NULLABLE_SCHEME,
});

const MEASURE_VALIDATION_SCHEME = yup.object().shape({
  title: TITLE_NAME_SCHEME,
  description: STRING_NULLABLE_SCHEME,
});

const CURRENCY_VALIDATION_SCHEME = yup.object().shape({
  title: TITLE_NAME_SCHEME,
  description: STRING_NULLABLE_SCHEME,
});

const CATEGORY_CURRENCY_MEASURE_SCHEME = yup.object().shape({
  title: TITLE_NAME_SCHEME,
});

module.exports = {
  REGISTRATION_VALIDATION_SCHEME,
  UPDATE_USER_VALIDATION_SCHEME,
  AUTH_VALIDATION_SCHEME,
  ITEM_VALIDATION_SCHEME,
  PRODUCT_VALIDATION_SCHEME,
  CATEGORY_VALIDATION_SCHEME,
  SHOP_VALIDATION_SCHEME,
  MEASURE_VALIDATION_SCHEME,
  CURRENCY_VALIDATION_SCHEME,
  CATEGORY_CURRENCY_MEASURE_SCHEME,
  PAGINATION_SCHEME,
};
