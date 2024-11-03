const { Router } = require('express');
// ==============================================================
const {
  getAllCurrencies,
  createCurrency,
  updateCurrency,
  getCurrencyById,
  deleteCurrency,
} = require('../controllers/currencyController');
const {
  validation: { validateCurrency },
} = require('../middlewares');

const currencyRouter = new Router();

currencyRouter
  .route('/')
  .get(getAllCurrencies)
  .post(validateCurrency, createCurrency);

currencyRouter
  .route('/:currencyId')
  .get(getCurrencyById)
  .patch(validateCurrency, updateCurrency)
  .delete(deleteCurrency);

module.exports = currencyRouter;
