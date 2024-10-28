const { Router } = require('express');
// =====================================
const categoryController = require('../controllers/categoryController');
const {
  validate: { validateCategory },
} = require('../middlewares');

const categoryRouter = new Router();

categoryRouter
  .route('/')
  .get(categoryController.getAllCategories)
  .post(validateCategory, categoryController.createCategory)
  .put(validateCategory, categoryController.updateCategory);

categoryRouter
  .route('/:categoryId')
  .get(categoryController.getCategoryById)
  .delete(categoryController.deleteCategory);

module.exports = categoryRouter;
