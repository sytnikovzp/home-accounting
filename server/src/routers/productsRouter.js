const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateProduct },
  pagination: { paginateElements },
} = require('../middlewares');

const {
  getAllProducts,
  getProductByUuid,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productsController');

const productsRouter = new Router();

productsRouter
  .route('/')
  .get(authHandler, paginateElements, getAllProducts)
  .post(authHandler, validateProduct, createProduct);

productsRouter
  .route('/:productUuid')
  .get(authHandler, getProductByUuid)
  .patch(authHandler, validateProduct, updateProduct)
  .delete(authHandler, deleteProduct);

module.exports = productsRouter;
