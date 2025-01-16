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

currenciesRouter
  .route('/')
  .get(authHandler, paginateElements, getAllCurrencies)
  .post(authHandler, validateCurrency, createCurrency);

currenciesRouter
  .route('/:currencyUuid')
  .get(authHandler, getCurrencyByUuid)
  .patch(authHandler, validateCurrency, updateCurrency)
  .delete(authHandler, deleteCurrency);

module.exports = currenciesRouter;
