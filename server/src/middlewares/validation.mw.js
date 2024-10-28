const {
  PRODUCT_SCHEMA,
  CAT_CURR_MEAS_SCHEMA,
  SHOP_SCHEMA,
  ITEM_SCHEMA,
} = require('../utils/validationSchemas');

module.exports.validateProducts = async (req, res, next) => {
  const { body } = req;
  try {
    await PRODUCT_SCHEMA.validate(body, { abortEarly: false });
    next();
  } catch (error) {
    console.log('Product is no valid');
    next(error);
  }
};

module.exports.validateCatCurrMeasure = async (req, res, next) => {
  const { body } = req;
  try {
    await CAT_CURR_MEAS_SCHEMA.validate(body, { abortEarly: false });
    next();
  } catch (error) {
    console.log('Category, currency or measure is no valid');
    next(error);
  }
};

module.exports.validateShop = async (req, res, next) => {
  const { body } = req;
  try {
    await SHOP_SCHEMA.validate(body, { abortEarly: false });
    next();
  } catch (error) {
    console.log('Shop is no valid');
    next(error);
  }
};

module.exports.validateItem = async (req, res, next) => {
  const { body } = req;
  try {
    await ITEM_SCHEMA.validate(body, { abortEarly: false });
    next();
  } catch (error) {
    console.log('Item is no valid');
    next(error);
  }
};

// const {
//   ITEM_VALIDATION_SCHEMA,
//   PRODUCT_VALIDATION_SCHEMA,
//   CATEGORY_VALIDATION_SCHEMA,
//   SHOP_VALIDATION_SCHEMA,
//   MEASURE_VALIDATION_SCHEMA,
//   CURRENCY_VALIDATION_SCHEMA,
// } = require('../utils/validationSchemas');

// const validateSchema = (schema) => async (req, res, next) => {
//   const { body } = req;
//   try {
//     await schema.validate(body, {
//       // abortEarly: false,
//     });
//     next();
//   } catch (error) {
//     console.log(error.message);
//     next(error);
//   }
// };

// module.exports = {
//   validateItem: validateSchema(ITEM_VALIDATION_SCHEMA),
//   validateProduct: validateSchema(PRODUCT_VALIDATION_SCHEMA),
//   validateCategory: validateSchema(CATEGORY_VALIDATION_SCHEMA),
//   validateShop: validateSchema(SHOP_VALIDATION_SCHEMA),
//   validateMeasure: validateSchema(MEASURE_VALIDATION_SCHEMA),
//   validateCurrency: validateSchema(CURRENCY_VALIDATION_SCHEMA),
// };
