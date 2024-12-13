const { Router } = require('express');
// ==============================================================
const {
  getAllPurchases,
  getPurchaseByUuid,
  createPurchase,
  updatePurchase,
  deletePurchase,
} = require('../controllers/purchaseController');
const {
  auth: { authHandler },
  validation: { validatePurchase },
  pagination: { paginateElements },
} = require('../middlewares');

const purchaseRouter = new Router();

purchaseRouter
  .route('/')
  .get(authHandler, paginateElements, getAllPurchases)
  .post(authHandler, validatePurchase, createPurchase);

purchaseRouter
  .route('/:purchaseUuid')
  .get(authHandler, getPurchaseByUuid)
  .patch(authHandler, validatePurchase, updatePurchase)
  .delete(authHandler, deletePurchase);

module.exports = purchaseRouter;
