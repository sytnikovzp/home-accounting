const yup = require('yup');

const TITLE_NAME_SCHEME = yup
  .string()
  .trim('Input cannot contain leading or trailing spaces')
  .min(2, 'Input must be at least 2 characters')
  .max(100, 'Input cannot exceed 100 characters')
  .required();

const STRING_NULLABLE_SCHEME = yup
  .string('This field must be a string!')
  .nullable();

const NUMBER_SCHEME = yup.number('This field must be a number!').required();

const ID_SCHEME = yup
  .number('This field must be a number!')
  .integer('This field must be integer!')
  .positive('This field must be more than 0!');

const URL_RESOURCE_SCHEME = yup.string().url().nullable();

const EMAIL_VALIDATION_SCHEME = yup.string().email().required();

const PAGINATION_SCHEME = yup.object().shape({
  limit: yup.number().min(1).max(500).required(),
  offset: yup.number().min(0).required(),
});

// ==============================================================

const REGISTRATION_VALIDATION_SCHEME = yup.object().shape({
  fullName: TITLE_NAME_SCHEME,
  email: EMAIL_VALIDATION_SCHEME,
  password: yup.string(),
});

const AUTH_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_VALIDATION_SCHEME,
  password: yup.string(),
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
