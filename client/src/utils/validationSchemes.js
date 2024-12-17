import * as yup from 'yup';
import { parse, isValid } from 'date-fns';
import { uk } from 'date-fns/locale';

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

const PASSWORD_SCHEME = yup
  .string('Це поле має бути рядком')
  .trim('Введені дані не можуть містити пробіли на початку або в кінці')
  .min(8, 'Введені дані мають бути не менше 8 символів')
  .max(20, 'Введені дані не можуть перевищувати 20 символів');

const NUMBER_REQUIRED_SCHEME = yup
  .number('Це поле має бути числом')
  .required('Це поле є обовʼязкове');

const ARRAY_OF_STRING_NULLABLE_SCHEME = yup
  .array('Це поле має бути масивом')
  .of(yup.string('Це поле має бути рядком').nullable());

const URL_RESOURCE_NULLABLE_SCHEME = yup
  .string('Це поле має бути рядком')
  .url('Введіть коректний URL')
  .nullable();

const EMAIL_VALIDATION_SCHEME = yup
  .string('Це поле має бути рядком')
  .email('Введіть коректний e-mail');

const STATUS_REQUIRED_SCHEME = yup
  .string('Це поле має бути рядком')
  .oneOf(['approved', 'rejected'], 'Неприпустиме значення для статусу')
  .required('Це поле є обовʼязкове');

const DATE_SCHEME = yup
  .date()
  .transform(parseDateString)
  .required('Оберіть дату')
  .typeError('Некоректний формат дати')
  .max(new Date(), 'Дата не може бути у майбутньому');

const PAGINATION_SCHEME = yup.object().shape({
  limit: yup.number().min(1).max(500).required(),
  offset: yup.number().min(0).required(),
});

// ==============================================================

const REGISTRATION_VALIDATION_SCHEME = yup.object().shape({
  fullName: STRING_REQUIRED_SCHEME,
  email: EMAIL_VALIDATION_SCHEME.required('E-mail є обовʼязковим полем'),
  password: PASSWORD_SCHEME.required('Пароль є обовʼязковим полем'),
});

const UPDATE_USER_VALIDATION_SCHEME = yup.object().shape({
  fullName: STRING_NULLABLE_SCHEME,
  email: EMAIL_VALIDATION_SCHEME.nullable(),
  password: PASSWORD_SCHEME.nullable(),
  role: STRING_NULLABLE_SCHEME,
});

const LOGIN_VALIDATION_SCHEME = yup.object().shape({
  email: EMAIL_VALIDATION_SCHEME.required('E-mail є обовʼязковим полем'),
  password: PASSWORD_SCHEME.required('Пароль є обовʼязковим полем'),
});

const ROLE_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_REQUIRED_SCHEME,
  description: STRING_NULLABLE_SCHEME,
  permissions: ARRAY_OF_STRING_NULLABLE_SCHEME,
});

const MODERATION_VALIDATION_SCHEME = yup.object().shape({
  status: STATUS_REQUIRED_SCHEME,
});

const PURCHASE_VALIDATION_SCHEME = yup.object().shape({
  product: STRING_REQUIRED_SCHEME,
  quantity: NUMBER_REQUIRED_SCHEME,
  unitPrice: NUMBER_REQUIRED_SCHEME,
  shop: STRING_REQUIRED_SCHEME,
  measure: STRING_REQUIRED_SCHEME,
  currency: STRING_REQUIRED_SCHEME,
  date: DATE_SCHEME,
});

const PRODUCT_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_REQUIRED_SCHEME,
  category: STRING_NULLABLE_SCHEME,
});

const CATEGORY_VALIDATION_SCHEME = yup.object().shape({
  title: STRING_REQUIRED_SCHEME,
});

const SHOP_VALIDATION_SCHEME = yup.object().shape({
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

export {
  REGISTRATION_VALIDATION_SCHEME,
  UPDATE_USER_VALIDATION_SCHEME,
  LOGIN_VALIDATION_SCHEME,
  ROLE_VALIDATION_SCHEME,
  MODERATION_VALIDATION_SCHEME,
  PURCHASE_VALIDATION_SCHEME,
  PRODUCT_VALIDATION_SCHEME,
  CATEGORY_VALIDATION_SCHEME,
  SHOP_VALIDATION_SCHEME,
  MEASURE_VALIDATION_SCHEME,
  CURRENCY_VALIDATION_SCHEME,
  PAGINATION_SCHEME,
};
