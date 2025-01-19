const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateCategory },
  pagination: { paginateElements },
} = require('../middlewares');

const {
  getAllCategories,
  getCategoryByUuid,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoriesController');

const categoriesRouter = new Router();

categoriesRouter.use(authHandler);

categoriesRouter
  .route('/')
  .get(paginateElements, getAllCategories)
  .post(validateCategory, createCategory);

categoriesRouter
  .route('/:categoryUuid')
  .get(getCategoryByUuid)
  .patch(validateCategory, updateCategory)
  .delete(deleteCategory);

module.exports = categoriesRouter;
