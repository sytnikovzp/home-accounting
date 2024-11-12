const { sequelize } = require('../db/dbPostgres/models');
const { getCurrentUser } = require('../services/userService');
const {
  getAllCategories,
  getCategoryById,
  updateCategoryStatus,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../services/categoryService');

class CategoryController {
  async getAllCategories(req, res, next) {
    try {
      const { status = 'approved' } = req.query;
      const allCategories = await getAllCategories(status);
      if (allCategories.length > 0) {
        res.status(200).json(allCategories);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get all categories error: ', error.message);
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const { categoryId } = req.params;
      const category = await getCategoryById(categoryId);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get category by id error: ', error.message);
      next(error);
    }
  }

  async reviewCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { categoryId } = req.params;
      const { status } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedCategory = await updateCategoryStatus(
        categoryId,
        status,
        currentUser,
        transaction
      );
      if (updatedCategory) {
        await transaction.commit();
        res.status(200).json(updatedCategory);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.log('Moderate category error: ', error.message);
      next(error);
    }
  }

  async createCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const newCategory = await createCategory(title, currentUser, transaction);
      if (newCategory) {
        await transaction.commit();
        res.status(201).json(newCategory);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.log('Create category error: ', error.message);
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { categoryId } = req.params;
      const { title } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedCategory = await updateCategory(
        categoryId,
        title,
        currentUser,
        transaction
      );
      if (updatedCategory) {
        await transaction.commit();
        res.status(200).json(updatedCategory);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.log('Update category error: ', error.message);
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { categoryId } = req.params;
      const currentUser = await getCurrentUser(req.user.email);
      const deletedCategory = await deleteCategory(
        categoryId,
        currentUser,
        transaction
      );
      if (deletedCategory) {
        await transaction.commit();
        res.sendStatus(res.statusCode);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.log('Delete category error: ', error.message);
      next(error);
    }
  }
}

module.exports = new CategoryController();
