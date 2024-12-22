const { Router } = require('express');
// ==============================================================
const {
  getAllProducts,
  getProductByUuid,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const {
  auth: { authHandler },
  validation: { validateProduct },
  pagination: { paginateElements },
} = require('../middlewares');

const productRouter = new Router();

productRouter
  .route('/')
  .get(authHandler, paginateElements, getAllProducts)
  .post(authHandler, validateProduct, createProduct);

productRouter
  .route('/:productUuid')
  .get(authHandler, getProductByUuid)
  .patch(authHandler, validateProduct, updateProduct)
  .delete(authHandler, deleteProduct);

module.exports = productRouter;
