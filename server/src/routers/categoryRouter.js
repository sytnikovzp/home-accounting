const { Router } = require('express');
// ==============================================================
const {
  getAllCategories,
  getCategoryByUuid,
  createCategory,
  updateCategory,
  moderateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const {
  auth: { authHandler },
  validation: { validateCategory, validateModeration },
  pagination: { paginateElements },
} = require('../middlewares');

const categoryRouter = new Router();

categoryRouter
  .route('/')
  .get(authHandler, paginateElements, getAllCategories)
  .post(authHandler, validateCategory, createCategory);

categoryRouter
  .route('/moderate/:categoryUuid')
  .patch(authHandler, validateModeration, moderateCategory);

categoryRouter
  .route('/:categoryUuid')
  .get(authHandler, getCategoryByUuid)
  .patch(authHandler, validateCategory, updateCategory)
  .delete(authHandler, deleteCategory);

module.exports = categoryRouter;
