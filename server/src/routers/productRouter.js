const { Router } = require('express');
// ==============================================================
const {
  getAllProducts,
  getProductById,
  reviewProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const {
  auth: { authHandler },
  validation: { validateProduct, validateModeration },
  pagination: { paginateElements },
} = require('../middlewares');

const productRouter = new Router();

productRouter
  .route('/')
  .get(authHandler, paginateElements, getAllProducts)
  .post(authHandler, validateProduct, createProduct);

productRouter
  .route('/moderate/:productId')
  .patch(authHandler, validateModeration, reviewProduct);

productRouter
  .route('/:productId')
  .get(authHandler, getProductById)
  .patch(authHandler, validateProduct, updateProduct)
  .delete(authHandler, deleteProduct);

module.exports = productRouter;
