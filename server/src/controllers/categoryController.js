const createError = require('http-errors');
// =====================================
const { Category, sequelize } = require('../db/dbPostgres/models');

class categoryController {
  async getAllCategories(req, res, next) {
    try {
      const allCategories = await Category.findAll({
        attributes: ['id', 'title'],
        raw: true,
        order: [['id', 'ASC']],
      });

      if (allCategories.length > 0) {
        res.status(200).json(allCategories);
      } else {
        next(createError(404, 'Categories not found!'));
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
        tranzaction: t,
        returning: ['id'],
      });

      if (newCategory) {
        await t.commit();
        res.status(201).json(newCategory);
      } else {
        await t.rollback();
        next(createError(404, 'Bad request'));
      }
    } catch (error) {
      await t.rollback();
      console.log(error.message);
      next(error);
    }
  }

  async updateCategory(req, res, next) {}

  async deleteCategory(req, res, next) {}
}

module.exports = new categoryController();
