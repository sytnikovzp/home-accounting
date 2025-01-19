const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateCurrency },
  pagination: { paginateElements },
} = require('../middlewares');

const {
  getAllCurrencies,
  getCurrencyByUuid,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} = require('../controllers/currenciesController');

const currenciesRouter = new Router();

currenciesRouter.use(authHandler);

currenciesRouter
  .route('/')
  .get(paginateElements, getAllCurrencies)
  .post(validateCurrency, createCurrency);

currenciesRouter
  .route('/:currencyUuid')
  .get(getCurrencyByUuid)
  .patch(validateCurrency, updateCurrency)
  .delete(deleteCurrency);

module.exports = currenciesRouter;
