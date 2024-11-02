const {
  REGISTRATION_VALIDATION_SCHEME,
  UPDATE_USER_VALIDATION_SCHEME,
  AUTH_VALIDATION_SCHEME,
  ITEM_VALIDATION_SCHEME,
  NEW_PRODUCT_VALIDATION_SCHEME,
  UPDATE_PRODUCT_VALIDATION_SCHEME,
  NEW_CATEGORY_VALIDATION_SCHEME,
  UPDATE_CATEGORY_VALIDATION_SCHEME,
  NEW_SHOP_VALIDATION_SCHEME,
  UPDATE_SHOP_VALIDATION_SCHEME,
  NEW_MEASURE_VALIDATION_SCHEME,
  UPDATE_MEASURE_VALIDATION_SCHEME,
  NEW_CURRENCY_VALIDATION_SCHEME,
  UPDATE_CURRENCY_VALIDATION_SCHEME,
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
  validateUpdateUser: validateSchema(UPDATE_USER_VALIDATION_SCHEME),
  validateAuth: validateSchema(AUTH_VALIDATION_SCHEME),
  validateItem: validateSchema(ITEM_VALIDATION_SCHEME),
  validateNewProduct: validateSchema(NEW_PRODUCT_VALIDATION_SCHEME),
  validateUpdProduct: validateSchema(UPDATE_PRODUCT_VALIDATION_SCHEME),
  validateNewCategory: validateSchema(NEW_CATEGORY_VALIDATION_SCHEME),
  validateUpdCategory: validateSchema(UPDATE_CATEGORY_VALIDATION_SCHEME),
  validateNewShop: validateSchema(NEW_SHOP_VALIDATION_SCHEME),
  validateUpdShop: validateSchema(UPDATE_SHOP_VALIDATION_SCHEME),
  validateNewMeasure: validateSchema(NEW_MEASURE_VALIDATION_SCHEME),
  validateUpdMeasure: validateSchema(UPDATE_MEASURE_VALIDATION_SCHEME),
  validateNewCurrency: validateSchema(NEW_CURRENCY_VALIDATION_SCHEME),
  validateUpdCurrency: validateSchema(UPDATE_CURRENCY_VALIDATION_SCHEME),
  validateCategoryCurrencyMeasure: validateSchema(
    CATEGORY_CURRENCY_MEASURE_SCHEME
  ),
};
