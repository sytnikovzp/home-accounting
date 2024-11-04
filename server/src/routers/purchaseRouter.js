const { Router } = require('express');
// ==============================================================
const {
  getAllPurchases,
  createPurchase,
  updatePurchase,
  getPurchaseById,
  deletePurchase,
} = require('../controllers/purchaseController');
const {
  validation: { validatePurchase },
  pagination: { paginateElements },
} = require('../middlewares');

const purchaseRouter = new Router();

purchaseRouter
  .route('/')
  .get(paginateElements, getAllPurchases)
  .post(validatePurchase, createPurchase);

purchaseRouter
  .route('/:purchaseId')
  .get(getPurchaseById)
  .patch(validatePurchase, updatePurchase)
  .delete(deletePurchase);

module.exports = purchaseRouter;
