const createError = require('http-errors');
const { format } = require('date-fns');
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
    try {
      const { categoryId } = req.params;

      const categoryById = await Category.findByPk(categoryId);

      if (categoryById) {
        const categoryData = categoryById.toJSON();

        const formattedCategory = {
          ...categoryData,
          description: categoryData.description || '',
          createdAt: format(
            new Date(categoryData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(categoryData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        res.status(200).json(formattedCategory);
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
      const { title, description: descriptionValue } = req.body;

      const description = descriptionValue === '' ? null : descriptionValue;

      const newBody = { title, description };

      const newCategory = await Category.create(newBody, {
        transaction: t,
        returning: true,
      });

      if (newCategory) {
        const categoryData = newCategory.toJSON();

        const formattedNewCategory = {
          ...categoryData,
          description: categoryData.description || '',
          createdAt: format(
            new Date(categoryData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(categoryData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        await t.commit();
        res.status(201).json(formattedNewCategory);
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
      const { id, title, description: descriptionValue } = req.body;

      const description = descriptionValue === '' ? null : descriptionValue;

      const newBody = { title, description };

      const [affectedRows, [updatedCategory]] = await Category.update(newBody, {
        where: { id },
        returning: true,
        transaction: t,
      });

      if (affectedRows > 0) {
        const categoryData = updatedCategory.toJSON();

        const formattedUpdCategory = {
          ...categoryData,
          description: categoryData.description || '',
          createdAt: format(
            new Date(categoryData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(categoryData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        await t.commit();
        res.status(201).json(formattedUpdCategory);
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

    try {
      const { categoryId } = req.params;

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
