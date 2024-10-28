const { Router } = require('express');
// =====================================
const currencyController = require('../controllers/currencyController');
const {
  validation: { validateCurrency },
} = require('../middlewares');

const currencyRouter = new Router();

currencyRouter
  .route('/')
  .get(currencyController.getAllCurrencies)
  .post(validateCurrency, currencyController.createCurrency)
  .put(validateCurrency, currencyController.updateCurrency);

currencyRouter
  .route('/:currencyId')
  .get(currencyController.getCurrencyById)
  .delete(currencyController.deleteCurrency);

module.exports = currencyRouter;
