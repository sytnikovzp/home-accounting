const { sequelize } = require('../db/dbPostgres/models');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../services/categoryService');

class CategoryController {
  async getAllCategories(req, res, next) {
    try {
      const allCategories = await getAllCategories();
      res.status(200).json(allCategories);
    } catch (error) {
      console.log('Get all categories error is: ', error.message);
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const { categoryId } = req.params;
      const category = await getCategoryById(categoryId);
      res.status(200).json(category);
    } catch (error) {
      console.log('Get category by id error is: ', error.message);
      next(error);
    }
  }

  async createCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, description } = req.body;
      const newCategory = await createCategory(title, description, transaction);
      await transaction.commit();
      res.status(201).json(newCategory);
    } catch (error) {
      await transaction.rollback();
      console.log('Creation category error is: ', error.message);
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { id, title, description } = req.body;
      const updatedCategory = await updateCategory(
        id,
        title,
        description,
        transaction
      );
      await transaction.commit();
      res.status(201).json(updatedCategory);
    } catch (error) {
      await transaction.rollback();
      console.log('Update category error is: ', error.message);
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { categoryId } = req.params;
      await deleteCategory(categoryId, transaction);
      await transaction.commit();
      res.sendStatus(res.statusCode);
    } catch (error) {
      await transaction.rollback();
      console.log('Deleting category error is: ', error.message);
      next(error);
    }
  }
}

module.exports = new CategoryController();
