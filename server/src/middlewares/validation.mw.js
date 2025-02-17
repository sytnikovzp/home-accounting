const {
  REGISTRATION_VALIDATION_SCHEME,
  LOGIN_VALIDATION_SCHEME,
  RESEND_CONFIRM_VALIDATION_SCHEME,
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
  validateCategory: validateSchema(CATEGORY_VALIDATION_SCHEME),
  validateCurrency: validateSchema(CURRENCY_VALIDATION_SCHEME),
  validateEstablishment: validateSchema(ESTABLISHMENT_VALIDATION_SCHEME),
  validateExpense: validateSchema(EXPENSE_VALIDATION_SCHEME),
  validateForgotPassword: validateSchema(FORGOT_PASSWORD_VALIDATION_SCHEME),
  validateLogin: validateSchema(LOGIN_VALIDATION_SCHEME),
  validateMeasure: validateSchema(MEASURE_VALIDATION_SCHEME),
  validateModeration: validateSchema(MODERATION_VALIDATION_SCHEME),
  validatePassword: validateSchema(PASSWORD_VALIDATION_SCHEME),
  validateProduct: validateSchema(PRODUCT_VALIDATION_SCHEME),
  validateRegistration: validateSchema(REGISTRATION_VALIDATION_SCHEME),
  validateResendConfirm: validateSchema(RESEND_CONFIRM_VALIDATION_SCHEME),
  validateRole: validateSchema(ROLE_VALIDATION_SCHEME),
  validateUser: validateSchema(USER_VALIDATION_SCHEME),
};
