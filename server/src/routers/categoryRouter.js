const { Router } = require('express');
// ==============================================================
const {
  getAllCategories,
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
} = require('../controllers/categoryController');
const {
  validation: { validateNewCategory, validateUpdCategory },
} = require('../middlewares');

const categoryRouter = new Router();

categoryRouter
  .route('/')
  .get(getAllCategories)
  .post(validateNewCategory, createCategory);

categoryRouter
  .route('/:categoryId')
  .get(getCategoryById)
  .patch(validateUpdCategory, updateCategory)
  .delete(deleteCategory);

module.exports = categoryRouter;
