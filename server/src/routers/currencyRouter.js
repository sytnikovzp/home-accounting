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
} = require('../controllers/currencyController');

const currencyRouter = new Router();

currencyRouter
  .route('/')
  .get(authHandler, paginateElements, getAllCurrencies)
  .post(authHandler, validateCurrency, createCurrency);

currencyRouter
  .route('/:currencyUuid')
  .get(authHandler, getCurrencyByUuid)
  .patch(authHandler, validateCurrency, updateCurrency)
  .delete(authHandler, deleteCurrency);

module.exports = currencyRouter;
