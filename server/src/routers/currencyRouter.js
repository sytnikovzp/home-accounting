const { Router } = require('express');
// ====================================================
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
  .post(validateCurrency, createCurrency)
  .put(validateCurrency, updateCurrency);

currencyRouter
  .route('/:currencyId')
  .get(getCurrencyById)
  .delete(deleteCurrency);

module.exports = currencyRouter;
