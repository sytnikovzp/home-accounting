import * as yup from 'yup';

import { parseDateString } from './sharedFunctions';

const STRING_SCHEME = yup
  .string('Це має бути рядком')
  .transform((value) => (value === null ? value : value.trim()))
  .max(100, 'Введені дані не можуть перевищувати 100 символів');

const PASSWORD_REQUIRED_SCHEME = yup
  .string('Це має бути рядком')
  .trim('Введені дані не можуть містити пробіли на початку або в кінці')
  .min(8, 'Введені дані мають бути не менше 8 символів')
  .max(20, 'Введені дані не можуть перевищувати 20 символів')
  .matches(/[a-z]/, 'Пароль повинен містити хоча б одну маленьку літеру')
  .matches(/[A-Z]/, 'Пароль повинен містити хоча б одну велику літеру')
  .matches(/\d/, 'Пароль повинен містити хоча б одну цифру')
  .required('Будь ласка, введіть пароль');

const PASSWORD_REQUIRED_CONFIRM_SCHEME = yup
  .string('Це має бути рядком')
  .oneOf([yup.ref('newPassword')], 'Паролі повинні співпадати')
  .required('Будь ласка, введіть підтвердження паролю');

const NUMBER_SCHEME = yup.number().typeError('Це має бути числом');

const ARRAY_OF_STRING_NULLABLE_SCHEME = yup
  .array('Це має бути масивом')
  .of(yup.string('Це має бути рядком').nullable());

const URL_RESOURCE_NULLABLE_SCHEME = yup
  .string('Це має бути рядком')
  .transform((value) => (value === null ? value : value.trim()))
  .max(100, 'Введені дані не можуть перевищувати 100 символів')
  .url('Введіть коректний URL')
  .nullable();

const EMAIL_SCHEME = yup
  .string('Це має бути рядком')
  .transform((value) => (value === null ? value : value.trim()))
  .max(100, 'Введені дані не можуть перевищувати 100 символів')
  .email('Введіть коректний e-mail');

const STATUS_REQUIRED_SCHEME = yup
  .string('Це має бути рядком')
  .oneOf(['approved', 'rejected'], 'Неприпустиме значення для статусу')
  .required('Будь ласка, оберіть статус');

const DATE_REQUIRED_SCHEME = yup
  .date()
  .transform(parseDateString)
  .typeError('Некоректний формат дати')
  .max(new Date(), 'Дата не може бути у майбутньому')
  .required('Будь ласка, оберіть дату');

const PAGINATION_SCHEME = yup.object().shape({
  limit: yup
    .number()
    .min(1, 'Мінімальне значення — 1')
    .max(500, 'Максимальне значення — 500')
    .required('Потрібно вказати limit'),
  offset: yup
    .number()
    .min(0, 'Мінімальне значення — 0')
    .required('Потрібно вказати offset'),
});

const REGISTRATION_VALIDATION_SCHEME = yup.object().shape({
  fullName: STRING_SCHEME.required('Будь ласка, введіть повне ім`я'),
  email: EMAIL_SCHEME.required('Будь ласка, введіть email'),
  password: PASSWORD_REQUIRED_SCHEME,
});

const LOGIN_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_SCHEME.required('Будь ласка, введіть email'),
  password: PASSWORD_REQUIRED_SCHEME,
});

const FORGOT_PASSWORD_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_SCHEME.required('Будь ласка, введіть email'),
});

const PASSWORD_VALIDATION_SCHEME = yup.object().shape({
  newPassword: PASSWORD_REQUIRED_SCHEME,
  confirmNewPassword: PASSWORD_REQUIRED_CONFIRM_SCHEME,
});

const USER_VALIDATION_SCHEME = yup.object().shape({
  fullName: STRING_SCHEME.required('Будь ласка, введіть повне ім`я'),
  email: EMAIL_SCHEME.nullable(),
  role: STRING_SCHEME.nullable(),
  photo: STRING_SCHEME.nullable(),
});

const ROLE_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_SCHEME.required('Будь ласка, введіть назву'),
  description: STRING_SCHEME.nullable(),
  permissions: ARRAY_OF_STRING_NULLABLE_SCHEME,
});

const MODERATION_VALIDATION_SCHEME = yup.object().shape({
  status: STATUS_REQUIRED_SCHEME,
});

const EXPENSE_VALIDATION_SCHEME = yup.object().shape({
  product: STRING_SCHEME.required('Будь ласка, оберіть товар/продукт'),
  quantity: NUMBER_SCHEME.required('Кількість обов`язкова'),
  measure: STRING_SCHEME.required('Будь ласка, оберіть одиницю'),
  unitPrice: NUMBER_SCHEME.required('Вартість обов`язкова'),
  currency: STRING_SCHEME.required('Будь ласка, оберіть валюту'),
  establishment: STRING_SCHEME.required('Будь ласка, оберіть заклад'),
  date: DATE_REQUIRED_SCHEME,
});

const PRODUCT_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_SCHEME.required('Будь ласка, введіть назву'),
  category: STRING_SCHEME.nullable(),
});

const CATEGORY_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_SCHEME.required('Будь ласка, введіть назву'),
});

const ESTABLISHMENT_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_SCHEME.required('Будь ласка, введіть назву'),
  description: STRING_SCHEME.nullable(),
  url: URL_RESOURCE_NULLABLE_SCHEME,
  logo: STRING_SCHEME.nullable(),
});

const MEASURE_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_SCHEME.required('Будь ласка, введіть назву'),
  description: STRING_SCHEME.required('Будь ласка, введіть опис'),
});

const CURRENCY_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_SCHEME.required('Будь ласка, введіть назву'),
  code: STRING_SCHEME.required('Будь ласка, введіть код валюти').matches(
    /^[A-Z]{3}$/,
    'Поле повинно містити рівно 3 великі латинські літери без цифр'
  ),
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
