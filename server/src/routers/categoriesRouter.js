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

categoriesRouter
  .route('/')
  .get(authHandler, paginateElements, getAllCategories)
  .post(authHandler, validateCategory, createCategory);

categoriesRouter
  .route('/:categoryUuid')
  .get(authHandler, getCategoryByUuid)
  .patch(authHandler, validateCategory, updateCategory)
  .delete(authHandler, deleteCategory);

module.exports = categoriesRouter;
