const { Router } = require('express');
// ==============================================================
const {
  getAllCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} = require('../controllers/currencyController');
const {
  auth: { authHandler },
  validation: { validateCurrency },
  pagination: { paginateElements },
} = require('../middlewares');

const currencyRouter = new Router();

currencyRouter
  .route('/')
  .get(authHandler, paginateElements, getAllCurrencies)
  .post(authHandler, validateCurrency, createCurrency);

currencyRouter
  .route('/:currencyId')
  .get(authHandler, getCurrencyById)
  .patch(authHandler, validateCurrency, updateCurrency)
  .delete(authHandler, deleteCurrency);

module.exports = currencyRouter;
