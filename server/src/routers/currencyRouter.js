const { Router } = require('express');
// =====================================
const currencyController = require('../controllers/currencyController');

const currencyRouter = new Router();

currencyRouter
  .route('/')
  .get(currencyController.getAllCurrencies)
  .post(currencyController.createCurrency)
  .put(currencyController.updateCurrency);

currencyRouter
  .route('/:currencyId')
  .get(currencyController.getCurrencyById)
  .delete(currencyController.deleteCurrency);

module.exports = currencyRouter;
