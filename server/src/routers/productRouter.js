const { Router } = require('express');
// =====================================
const productController = require('../controllers/productController');
const {
  validation: { validateProduct },
  pagination: { paginateElements },
} = require('../middlewares');

const productRouter = new Router();

productRouter
  .route('/')
  .get(paginateElements, productController.getAllProducts)
  .post(validateProduct, productController.createProduct)
  .put(validateProduct, productController.updateProduct);

productRouter
  .route('/:productId')
  .get(productController.getProductById)
  .delete(productController.deleteProduct);

module.exports = productRouter;
