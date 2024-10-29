const { Category } = require('../db/dbPostgres/models');
const { notFound, badRequest } = require('../errors/customErrors');
const { formatDate } = require('../utils/sharedFunctions');

class CategoryService {
  async getAllCategories() {
    const allCategories = await Category.findAll({
      attributes: ['id', 'title'],
      raw: true,
    });
    if (allCategories.length === 0) {
      throw notFound('Categories not found');
    }
    return allCategories;
  }

  async getCategoryById(categoryId) {
    const categoryById = await Category.findByPk(categoryId);
    if (!categoryById) {
      throw notFound('Category not found');
    }
    const categoryData = categoryById.toJSON();
    return {
      ...categoryData,
      description: categoryData.description || '',
      createdAt: formatDate(categoryData.createdAt),
      updatedAt: formatDate(categoryData.updatedAt),
    };
  }

  async createCategory(title, descriptionValue, transaction) {
    const existingCategory = await Category.findOne({ where: { title } });
    if (existingCategory) {
      throw badRequest('This category already exists');
    }
    const description = descriptionValue === '' ? null : descriptionValue;
    const newCategory = await Category.create(
      { title, description },
      { transaction }
    );
    return {
      id: newCategory.id,
      title: newCategory.title,
      description: newCategory.description || '',
    };
  }

  async updateCategory(id, title, descriptionValue, transaction) {
    const categoryById = await Category.findByPk(id);
    if (!categoryById) {
      throw notFound('Category not found');
    }
    const currentTitle = categoryById.title;
    if (title !== currentTitle) {
      const existingCategory = await Category.findOne({ where: { title } });
      if (existingCategory) {
        throw badRequest('This category already exists');
      }
    } else {
      title = currentTitle;
    }
    const updateData = { title };
    if (descriptionValue !== undefined) {
      const description = descriptionValue === '' ? null : descriptionValue;
      updateData.description = description;
    }
    const [affectedRows, [updatedCategory]] = await Category.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (affectedRows === 0) {
      throw badRequest('Category not updated');
    }
    return {
      id: updatedCategory.id,
      title: updatedCategory.title,
      description: updatedCategory.description || '',
    };
  }

  async deleteCategory(categoryId, transaction) {
    const categoryById = await Category.findByPk(categoryId);
    if (!categoryById) {
      throw notFound('Category not found');
    }
    const deleteCategory = await Category.destroy({
      where: { id: categoryId },
      transaction,
    });
    if (!deleteCategory) {
      throw badRequest('Category not deleted');
    }
    return deleteCategory;
  }
}

module.exports = new CategoryService();
