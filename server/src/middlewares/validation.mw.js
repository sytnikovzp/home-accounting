const {
  REGISTRATION_VALIDATION_SCHEME,
  AUTH_VALIDATION_SCHEME,
  ITEM_VALIDATION_SCHEME,
  PRODUCT_VALIDATION_SCHEME,
  CATEGORY_VALIDATION_SCHEME,
  SHOP_VALIDATION_SCHEME,
  MEASURE_VALIDATION_SCHEME,
  CURRENCY_VALIDATION_SCHEME,
  CATEGORY_CURRENCY_MEASURE_SCHEME,
} = require('../utils/validationSchemes');

const validateSchema = (schema) => async (req, res, next) => {
  try {
    const { body } = req;
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
  validateRegistration: validateSchema(REGISTRATION_VALIDATION_SCHEME),
  validateAuth: validateSchema(AUTH_VALIDATION_SCHEME),
  validateItem: validateSchema(ITEM_VALIDATION_SCHEME),
  validateProduct: validateSchema(PRODUCT_VALIDATION_SCHEME),
  validateCategory: validateSchema(CATEGORY_VALIDATION_SCHEME),
  validateShop: validateSchema(SHOP_VALIDATION_SCHEME),
  validateMeasure: validateSchema(MEASURE_VALIDATION_SCHEME),
  validateCurrency: validateSchema(CURRENCY_VALIDATION_SCHEME),
  validateCategoryCurrencyMeasure: validateSchema(
    CATEGORY_CURRENCY_MEASURE_SCHEME
  ),
};
