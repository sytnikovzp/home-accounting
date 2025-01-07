const { sequelize } = require('../db/dbPostgres/models');

const {
  getAllCategories,
  getCategoryByUuid,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../services/categoryService');
const { getCurrentUser } = require('../services/userService');

class CategoryController {
  async getAllCategories(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { status = 'approved', sort = 'uuid', order = 'asc' } = req.query;
      const { allCategories, total } = await getAllCategories(
        status,
        limit,
        offset,
        sort,
        order
      );
      if (allCategories.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allCategories);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get all categories error: ', error.message);
      next(error);
    }
  }

  async getCategoryByUuid(req, res, next) {
    try {
      const { categoryUuid } = req.params;
      const category = await getCategoryByUuid(categoryUuid);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get category by uuid error: ', error.message);
      next(error);
    }
  }

  async createCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
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
      console.error('Create category error: ', error.message);
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { categoryUuid } = req.params;
      const { title } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedCategory = await updateCategory(
        categoryUuid,
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
      console.error('Update category error: ', error.message);
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { categoryUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.uuid);
      const deletedCategory = await deleteCategory(
        categoryUuid,
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
      console.error('Delete category error: ', error.message);
      next(error);
    }
  }
}

module.exports = new CategoryController();
