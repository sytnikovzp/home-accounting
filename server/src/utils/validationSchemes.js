const { parse, isValid } = require('date-fns');
const { uk } = require('date-fns/locale');
const yup = require('yup');

const parseDateString = (value, originalValue) => {
  if (typeof originalValue === 'string') {
    const parsedDate = parse(originalValue, 'dd MMMM yyyy', new Date(), {
      locale: uk,
    });
    return isValid(parsedDate) ? parsedDate : new Date('');
  }
  return originalValue;
};

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
  .matches(/[0-9]/, 'Пароль повинен містити хоча б одну цифру')
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

const STATUS_REQUIRED_SCHEME = yup
  .string('Це поле має бути рядком')
  .oneOf(['approved', 'rejected'], 'Неприпустиме значення для статусу')
  .required('Це поле є обовʼязкове');

const DATE_REQUIRED_SCHEME = yup
  .date()
  .transform(parseDateString)
  .typeError('Некоректний формат дати')
  .max(new Date(), 'Дата не може бути у майбутньому')
  .required('Оберіть дату');

const PAGINATION_SCHEME = yup.object().shape({
  limit: yup.number().min(1).max(500).required(),
  offset: yup.number().min(0).required(),
});

const REGISTRATION_VALIDATION_SCHEME = yup.object().shape({
  fullName: STRING_REQUIRED_SCHEME,
  email: EMAIL_REQUIRED_VALIDATION_SCHEME,
  password: PASSWORD_REQUIRED_SCHEME,
});

const LOGIN_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_REQUIRED_VALIDATION_SCHEME,
  password: PASSWORD_REQUIRED_SCHEME,
});

const RESEND_VERIFY_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_REQUIRED_VALIDATION_SCHEME,
});

const FORGOT_PASSWORD_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_REQUIRED_VALIDATION_SCHEME,
});

const PASSWORD_VALIDATION_SCHEME = yup.object().shape({
  newPassword: PASSWORD_REQUIRED_SCHEME,
  confirmNewPassword: PASSWORD_REQUIRED_CONFIRM_SCHEME,
});

const USER_VALIDATION_SCHEME = yup.object().shape({
  fullName: STRING_REQUIRED_SCHEME,
  email: EMAIL_REQUIRED_VALIDATION_SCHEME,
  role: STRING_REQUIRED_SCHEME,
  photo: STRING_NULLABLE_SCHEME,
});

const ROLE_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_REQUIRED_SCHEME,
  description: STRING_NULLABLE_SCHEME,
  permissions: ARRAY_OF_STRING_NULLABLE_SCHEME,
});

const MODERATION_VALIDATION_SCHEME = yup.object().shape({
  status: STATUS_REQUIRED_SCHEME,
});

const EXPENSE_VALIDATION_SCHEME = yup.object().shape({
  product: STRING_REQUIRED_SCHEME,
  quantity: NUMBER_REQUIRED_SCHEME,
  unitPrice: NUMBER_REQUIRED_SCHEME,
  establishment: STRING_REQUIRED_SCHEME,
  measure: STRING_REQUIRED_SCHEME,
  currency: STRING_REQUIRED_SCHEME,
  date: DATE_REQUIRED_SCHEME,
});

const PRODUCT_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_REQUIRED_SCHEME,
  category: STRING_NULLABLE_SCHEME,
});

const CATEGORY_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_REQUIRED_SCHEME,
});

const ESTABLISHMENT_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_REQUIRED_SCHEME,
  description: STRING_NULLABLE_SCHEME,
  url: URL_RESOURCE_NULLABLE_SCHEME,
  logo: STRING_NULLABLE_SCHEME,
});

const MEASURE_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_REQUIRED_SCHEME,
  description: STRING_REQUIRED_SCHEME,
});

const CURRENCY_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_REQUIRED_SCHEME,
  code: STRING_REQUIRED_SCHEME.matches(
    /^[A-Z]{3}$/,
    'Поле повинно містити рівно 3 великі латинські літери без цифр'
  ),
});

module.exports = {
  PAGINATION_SCHEME,
  REGISTRATION_VALIDATION_SCHEME,
  LOGIN_VALIDATION_SCHEME,
  RESEND_VERIFY_VALIDATION_SCHEME,
  FORGOT_PASSWORD_VALIDATION_SCHEME,
  PASSWORD_VALIDATION_SCHEME,
  USER_VALIDATION_SCHEME,
  ROLE_VALIDATION_SCHEME,
  MODERATION_VALIDATION_SCHEME,
  EXPENSE_VALIDATION_SCHEME,
  PRODUCT_VALIDATION_SCHEME,
  CATEGORY_VALIDATION_SCHEME,
  ESTABLISHMENT_VALIDATION_SCHEME,
  MEASURE_VALIDATION_SCHEME,
  CURRENCY_VALIDATION_SCHEME,
};
