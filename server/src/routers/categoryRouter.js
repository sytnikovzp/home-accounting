const { Router } = require('express');
// =====================================
const {
  getAllCategories,
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
} = require('../controllers/categoryController');
const {
  validation: { validateCategory },
} = require('../middlewares');

const categoryRouter = new Router();

categoryRouter
  .route('/')
  .get(getAllCategories)
  .post(validateCategory, createCategory)
  .put(validateCategory, updateCategory);

categoryRouter
  .route('/:categoryId')
  .get(getCategoryById)
  .delete(deleteCategory);

module.exports = categoryRouter;
