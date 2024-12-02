const { Router } = require('express');
// ==============================================================
const {
  getAllCategories,
  getCategoryById,
  reviewCategory,
  createCategory,
  updateCategory,
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
  .route('/moderate/:categoryId')
  .patch(authHandler, validateModeration, reviewCategory);

categoryRouter
  .route('/:categoryId')
  .get(authHandler, getCategoryById)
  .patch(authHandler, validateCategory, updateCategory)
  .delete(authHandler, deleteCategory);

module.exports = categoryRouter;
