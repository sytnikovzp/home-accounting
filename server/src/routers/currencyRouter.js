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
  validation: { validateNewCurrency, validateUpdCurrency },
} = require('../middlewares');

const currencyRouter = new Router();

currencyRouter
  .route('/')
  .get(getAllCurrencies)
  .post(validateNewCurrency, createCurrency);

currencyRouter
  .route('/:currencyId')
  .get(getCurrencyById)
  .patch(validateUpdCurrency, updateCurrency)
  .delete(deleteCurrency);

module.exports = currencyRouter;
