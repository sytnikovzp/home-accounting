const {
  REGISTRATION_VALIDATION_SCHEMA,
  AUTH_VALIDATION_SCHEMA,
  ITEM_VALIDATION_SCHEMA,
  PRODUCT_VALIDATION_SCHEMA,
  CATEGORY_VALIDATION_SCHEMA,
  SHOP_VALIDATION_SCHEMA,
  MEASURE_VALIDATION_SCHEMA,
  CURRENCY_VALIDATION_SCHEMA,
  CATEGORY_CURRENCY_MEASURE_SCHEMA,
} = require('../utils/validationSchemas');

const validateSchema = (schema) => async (req, res, next) => {
  const { body } = req;
  try {
    await schema.validate(body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = {
  validateRegistration: validateSchema(REGISTRATION_VALIDATION_SCHEMA),
  validateAuth: validateSchema(AUTH_VALIDATION_SCHEMA),
  validateItem: validateSchema(ITEM_VALIDATION_SCHEMA),
  validateProduct: validateSchema(PRODUCT_VALIDATION_SCHEMA),
  validateCategory: validateSchema(CATEGORY_VALIDATION_SCHEMA),
  validateShop: validateSchema(SHOP_VALIDATION_SCHEMA),
  validateMeasure: validateSchema(MEASURE_VALIDATION_SCHEMA),
  validateCurrency: validateSchema(CURRENCY_VALIDATION_SCHEMA),
  validateCategoryCurrencyMeasure: validateSchema(
    CATEGORY_CURRENCY_MEASURE_SCHEMA
  ),
};
