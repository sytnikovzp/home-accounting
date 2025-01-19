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

productsRouter.use(authHandler);

productsRouter
  .route('/')
  .get(paginateElements, getAllProducts)
  .post(validateProduct, createProduct);

productsRouter
  .route('/:productUuid')
  .get(getProductByUuid)
  .patch(validateProduct, updateProduct)
  .delete(deleteProduct);

module.exports = productsRouter;
