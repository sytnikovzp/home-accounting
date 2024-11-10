const { Router } = require('express');
// ==============================================================
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const {
  validation: { validateProduct },
  pagination: { paginateElements },
} = require('../middlewares');

const productRouter = new Router();

productRouter
  .route('/')
  .get(paginateElements, getAllProducts)
  .post(validateProduct, createProduct);

productRouter
  .route('/:productId')
  .get(getProductById)
  .patch(validateProduct, updateProduct)
  .delete(deleteProduct);

module.exports = productRouter;
