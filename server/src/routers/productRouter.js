const { Router } = require('express');
// ====================================================
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getProductById,
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
  .post(validateProduct, createProduct)
  .put(validateProduct, updateProduct);

productRouter
  .route('/:productId')
  .get(getProductById)
  .delete(deleteProduct);

module.exports = productRouter;
