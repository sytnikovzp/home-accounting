import * as yup from 'yup';

import { parseDateString } from './sharedFunctions';

const STRING_REQUIRED_SCHEME = yup
  .string('Це поле має бути рядком')
  .trim('Введені дані не можуть містити пробіли на початку або в кінці')
  .max(100, 'Введені дані не можуть перевищувати 100 символів')
  .required('Це поле є обовʼязкове');

const STRING_NULLABLE_SCHEME = yup
  .string('Це поле має бути рядком')
  .trim('Введені дані не можуть містити пробіли на початку або в кінці')
  .max(100, 'Введені дані не можуть перевищувати 100 символів')
  .nullable();

const PASSWORD_REQUIRED_SCHEME = yup
  .string('Це поле має бути рядком')
  .trim('Введені дані не можуть містити пробіли на початку або в кінці')
  .min(8, 'Введені дані мають бути не менше 8 символів')
  .max(20, 'Введені дані не можуть перевищувати 20 символів')
  .matches(/[a-z]/, 'Пароль повинен містити хоча б одну маленьку літеру')
  .matches(/[A-Z]/, 'Пароль повинен містити хоча б одну велику літеру')
  .matches(/\d/, 'Пароль повинен містити хоча б одну цифру')
  .required('Пароль є обовʼязковим полем');

const PASSWORD_REQUIRED_CONFIRM_SCHEME = yup
  .string('Це поле має бути рядком')
  .oneOf([yup.ref('newPassword')], 'Паролі повинні співпадати')
  .required('Підтвердження паролю є обов’язковим');

const NUMBER_REQUIRED_SCHEME = yup
  .number()
  .typeError('Це поле має бути числом')
  .required('Це поле є обовʼязкове');

const ARRAY_OF_STRING_NULLABLE_SCHEME = yup
  .array('Це поле має бути масивом')
  .of(yup.string('Це поле має бути рядком').nullable());

const URL_RESOURCE_NULLABLE_SCHEME = yup
  .string('Це поле має бути рядком')
  .url('Введіть коректний URL')
  .nullable();

const EMAIL_REQUIRED_VALIDATION_SCHEME = yup
  .string('Це поле має бути рядком')
  .email('Введіть коректний e-mail')
  .required('E-mail є обовʼязковим полем');

const EMAIL_NULLABLE_VALIDATION_SCHEME = yup
  .string('Це поле має бути рядком')
  .email('Введіть коректний e-mail')
  .nullable();

const STATUS_REQUIRED_SCHEME = yup
  .string('Це поле має бути рядком')
  .oneOf(['approved', 'rejected'], 'Неприпустиме значення для статусу')
  .required('Це поле є обовʼязкове');

const DATE_REQUIRED_SCHEME = yup
  .date()
  .transform(parseDateString)
  .typeError('Некоректний формат дати')
  .max(new Date(), 'Дата не може бути у майбутньому')
  .required('Це поле є обовʼязкове');

const PAGINATION_SCHEME = yup.object().shape({
  limit: yup.number().min(1).max(500).required(),
  offset: yup.number().min(0).required(),
});

const REGISTRATION_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_REQUIRED_VALIDATION_SCHEME,
  fullName: STRING_REQUIRED_SCHEME,
  password: PASSWORD_REQUIRED_SCHEME,
});

const LOGIN_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_REQUIRED_VALIDATION_SCHEME,
  password: PASSWORD_REQUIRED_SCHEME,
});

const FORGOT_PASSWORD_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_REQUIRED_VALIDATION_SCHEME,
});

const PASSWORD_VALIDATION_SCHEME = yup.object().shape({
  confirmNewPassword: PASSWORD_REQUIRED_CONFIRM_SCHEME,
  newPassword: PASSWORD_REQUIRED_SCHEME,
});

const USER_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_NULLABLE_VALIDATION_SCHEME,
  fullName: STRING_REQUIRED_SCHEME,
  photo: STRING_NULLABLE_SCHEME,
  role: STRING_NULLABLE_SCHEME,
});

const ROLE_VALIDATION_SCHEME = yup.object().shape({
  description: STRING_NULLABLE_SCHEME,
  permissions: ARRAY_OF_STRING_NULLABLE_SCHEME,
  title: STRING_REQUIRED_SCHEME,
});

const MODERATION_VALIDATION_SCHEME = yup.object().shape({
  status: STATUS_REQUIRED_SCHEME,
});

const EXPENSE_VALIDATION_SCHEME = yup.object().shape({
  currency: STRING_REQUIRED_SCHEME,
  date: DATE_REQUIRED_SCHEME,
  establishment: STRING_REQUIRED_SCHEME,
  measure: STRING_REQUIRED_SCHEME,
  product: STRING_REQUIRED_SCHEME,
  quantity: NUMBER_REQUIRED_SCHEME,
  unitPrice: NUMBER_REQUIRED_SCHEME,
});

const PRODUCT_VALIDATION_SCHEME = yup.object().shape({
  category: STRING_NULLABLE_SCHEME,
  title: STRING_REQUIRED_SCHEME,
});

const CATEGORY_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_REQUIRED_SCHEME,
});

const ESTABLISHMENT_VALIDATION_SCHEME = yup.object().shape({
  description: STRING_NULLABLE_SCHEME,
  logo: STRING_NULLABLE_SCHEME,
  title: STRING_REQUIRED_SCHEME,
  url: URL_RESOURCE_NULLABLE_SCHEME,
});

const MEASURE_VALIDATION_SCHEME = yup.object().shape({
  description: STRING_REQUIRED_SCHEME,
  title: STRING_REQUIRED_SCHEME,
});

const CURRENCY_VALIDATION_SCHEME = yup.object().shape({
  code: STRING_REQUIRED_SCHEME.matches(
    /^[A-Z]{3}$/,
    'Поле повинно містити рівно 3 великі латинські літери без цифр'
  ),
  title: STRING_REQUIRED_SCHEME,
});

export {
  CATEGORY_VALIDATION_SCHEME,
  CURRENCY_VALIDATION_SCHEME,
  ESTABLISHMENT_VALIDATION_SCHEME,
  EXPENSE_VALIDATION_SCHEME,
  FORGOT_PASSWORD_VALIDATION_SCHEME,
  LOGIN_VALIDATION_SCHEME,
  MEASURE_VALIDATION_SCHEME,
  MODERATION_VALIDATION_SCHEME,
  PAGINATION_SCHEME,
  PASSWORD_VALIDATION_SCHEME,
  PRODUCT_VALIDATION_SCHEME,
  REGISTRATION_VALIDATION_SCHEME,
  ROLE_VALIDATION_SCHEME,
  USER_VALIDATION_SCHEME,
};
