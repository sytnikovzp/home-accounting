const createError = require('http-errors');
// =====================================
const { Category, sequelize } = require('../db/dbPostgres/models');

class categoryController {
  async getAllCategories(req, res, next) {
    try {
      const allCategories = await Category.findAll({
        attributes: ['id', 'title'],
        raw: true,
      });

      if (allCategories.length > 0) {
        res.status(200).json(allCategories);
      } else {
        next(createError(404, 'Categories not found'));
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    const { categoryId } = req.params;

    try {
      const categoryById = await Category.findByPk(categoryId);

      if (categoryById) {
        res.status(200).json(categoryById);
      } else {
        next(createError(404, 'Category not found'));
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async createCategory(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const body = req.body;

      const newCategory = await Category.create(body, {
        transaction: t,
        returning: ['id'],
      });

      if (newCategory) {
        await t.commit();
        res.status(201).json(newCategory);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id, title, description } = req.body;

      const newBody = { title, description };

      const [affectedRows, [updatedCategory]] = await Category.update(newBody, {
        where: { id },
        returning: true,
        transaction: t,
      });

      if (affectedRows > 0) {
        await t.commit();
        res.status(201).json(updatedCategory);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    const t = await sequelize.transaction();

    const { categoryId } = req.params;

    try {
      const deleteCategory = await Category.destroy({
        where: {
          id: categoryId,
        },
        transaction: t,
      });

      if (deleteCategory) {
        await t.commit();
        res.sendStatus(res.statusCode);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }
}

module.exports = new categoryController();
