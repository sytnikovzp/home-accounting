const {
  REGISTRATION_VALIDATION_SCHEME,
  UPDATE_USER_VALIDATION_SCHEME,
  PASSWORD_VALIDATION_SCHEME,
  LOGIN_VALIDATION_SCHEME,
  ROLE_VALIDATION_SCHEME,
  MODERATION_VALIDATION_SCHEME,
  PURCHASE_VALIDATION_SCHEME,
  PRODUCT_VALIDATION_SCHEME,
  CATEGORY_VALIDATION_SCHEME,
  SHOP_VALIDATION_SCHEME,
  MEASURE_VALIDATION_SCHEME,
  CURRENCY_VALIDATION_SCHEME,
} = require('../utils/validationSchemes');

const validateSchema = (schema) => async (req, res, next) => {
  try {
    const { body } = req;
    await schema.validate(body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  validateRegistration: validateSchema(REGISTRATION_VALIDATION_SCHEME),
  validateUpdateUser: validateSchema(UPDATE_USER_VALIDATION_SCHEME),
  validateAuth: validateSchema(LOGIN_VALIDATION_SCHEME),
  validatePassword: validateSchema(PASSWORD_VALIDATION_SCHEME),
  validateRole: validateSchema(ROLE_VALIDATION_SCHEME),
  validateModeration: validateSchema(MODERATION_VALIDATION_SCHEME),
  validatePurchase: validateSchema(PURCHASE_VALIDATION_SCHEME),
  validateProduct: validateSchema(PRODUCT_VALIDATION_SCHEME),
  validateCategory: validateSchema(CATEGORY_VALIDATION_SCHEME),
  validateShop: validateSchema(SHOP_VALIDATION_SCHEME),
  validateMeasure: validateSchema(MEASURE_VALIDATION_SCHEME),
  validateCurrency: validateSchema(CURRENCY_VALIDATION_SCHEME),
};
