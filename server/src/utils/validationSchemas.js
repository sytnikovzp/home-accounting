const yup = require('yup');

const TITLE_SCHEMA = yup
  .string()
  .trim('Input cannot contain leading or trailing spaces')
  .min(2, 'Input must be at least 2 characters')
  .max(60, 'Input cannot exceed 60 characters')
  .matches(
    /^[A-Z][a-zA-Z0-9\s'–:.-]+(?:\s[A-Z][a-zA-Z0-9\s'–:.-]+)*$/,
    'Input must start with an uppercase letter [A-Z] and can contain letters [A-z], digits, spaces, apostrophes, and dashes.'
  );

const STRING_NULLABLE_SCHEMA = yup.string().nullable();

const DECIMAL_SCHEMA = yup
  .number('This field must be a number!')
  .transform((value, originalValue) =>
    originalValue.trim() === '' ? null : value
  )
  .nullable();

const ID_SCHEMA = yup
  .number('This field must be a number!')
  .integer('This field must be integer!')
  .positive('This field must be more than 0!');

const URL_RESOURCE_SCHEMA = yup.string().url().nullable();

const PAGINATION_SCHEMA = yup.object().shape({
  limit: yup.number().min(1).max(500).required(),
  offset: yup.number().min(0).required(),
});

// ======================================================

const ITEM_VALIDATION_SCHEMA = yup.object().shape({
  product: yup.string().required(),
  amount: DECIMAL_SCHEMA,
  price: DECIMAL_SCHEMA,
  shop: STRING_NULLABLE_SCHEMA,
  measure: STRING_NULLABLE_SCHEMA,
  currency: STRING_NULLABLE_SCHEMA,
});

const PRODUCT_VALIDATION_SCHEMA = yup.object().shape({
  title: TITLE_SCHEMA.required(),
  description: STRING_NULLABLE_SCHEMA,
  categoryId: ID_SCHEMA,
});

const CATEGORY_VALIDATION_SCHEMA = yup.object().shape({
  title: TITLE_SCHEMA.required(),
  description: STRING_NULLABLE_SCHEMA,
});

const SHOP_VALIDATION_SCHEMA = yup.object().shape({
  title: TITLE_SCHEMA.required(),
  description: STRING_NULLABLE_SCHEMA,
  url: URL_RESOURCE_SCHEMA,
  image: STRING_NULLABLE_SCHEMA,
});

const MEASURE_VALIDATION_SCHEMA = yup.object().shape({
  title: TITLE_SCHEMA.required(),
  description: STRING_NULLABLE_SCHEMA,
});

const CURRENCY_VALIDATION_SCHEMA = yup.object().shape({
  title: TITLE_SCHEMA.required(),
  description: STRING_NULLABLE_SCHEMA,
});

module.exports = {
  ITEM_VALIDATION_SCHEMA,
  PRODUCT_VALIDATION_SCHEMA,
  CATEGORY_VALIDATION_SCHEMA,
  SHOP_VALIDATION_SCHEMA,
  MEASURE_VALIDATION_SCHEMA,
  CURRENCY_VALIDATION_SCHEMA,
  PAGINATION_SCHEMA,
};
