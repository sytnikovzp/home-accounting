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
} = require('../controllers/categoryController');

const categoryRouter = new Router();

categoryRouter
  .route('/')
  .get(authHandler, paginateElements, getAllCategories)
  .post(authHandler, validateCategory, createCategory);

categoryRouter
  .route('/:categoryUuid')
  .get(authHandler, getCategoryByUuid)
  .patch(authHandler, validateCategory, updateCategory)
  .delete(authHandler, deleteCategory);

module.exports = categoryRouter;
