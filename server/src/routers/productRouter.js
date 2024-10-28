const { Router } = require('express');
// =====================================
const productController = require('../controllers/productController');

const productRouter = new Router();

productRouter
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct)
  .put(productController.updateProduct);

productRouter
  .route('/:productId')
  .get(productController.getProductById)
  .delete(productController.deleteProduct);

module.exports = productRouter;
