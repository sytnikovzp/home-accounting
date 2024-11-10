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
} = require('../middlewares');

const categoryRouter = new Router();

categoryRouter
  .route('/')
  .get(authHandler, getAllCategories)
  .post(authHandler, validateCategory, createCategory);

categoryRouter
  .route('/:categoryId')
  .get(authHandler, getCategoryById)
  .patch(authHandler, validateCategory, updateCategory)
  .delete(authHandler, deleteCategory);

categoryRouter
  .route('/:categoryId/moderate')
  .patch(authHandler, validateModeration, reviewCategory);

module.exports = categoryRouter;
