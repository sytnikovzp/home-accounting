const { Router } = require('express');
// ==============================================================
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct,
} = require('../controllers/productController');
const {
  validation: { validateNewProduct, validateUpdProduct },
  pagination: { paginateElements },
} = require('../middlewares');

const productRouter = new Router();

productRouter
  .route('/')
  .get(paginateElements, getAllProducts)
  .post(validateNewProduct, createProduct);

productRouter
  .route('/:productId')
  .get(getProductById)
  .patch(validateUpdProduct, updateProduct)
  .delete(deleteProduct);

module.exports = productRouter;
