const { Category } = require('../db/dbPostgres/models');
const { notFound, badRequest } = require('../errors/customErrors');
const { formatDate } = require('../utils/sharedFunctions');

class CategoryService {
  async getAllCategories() {
    const foundCategories = await Category.findAll({
      attributes: ['id', 'title'],
      raw: true,
    });
    if (foundCategories.length === 0) throw notFound('Categories not found');
    return foundCategories;
  }

  async getCategoryById(categoryId) {
    const foundCategory = await Category.findByPk(categoryId);
    if (!foundCategory) throw notFound('Category not found');
    const categoryData = foundCategory.toJSON();
    return {
      ...categoryData,
      description: categoryData.description || '',
      createdAt: formatDate(categoryData.createdAt),
      updatedAt: formatDate(categoryData.updatedAt),
    };
  }

  async createCategory(title, descriptionValue, transaction) {
    const duplicateCategory = await Category.findOne({ where: { title } });
    if (duplicateCategory) throw badRequest('This category already exists');
    const description = descriptionValue === '' ? null : descriptionValue;
    const newCategory = await Category.create(
      { title, description },
      { transaction, returning: true }
    );
    if (!newCategory) throw badRequest('Category is not created');
    return {
      id: newCategory.id,
      title: newCategory.title,
      description: newCategory.description || '',
    };
  }

  async updateCategory(id, title, descriptionValue, transaction) {
    const foundCategory = await Category.findByPk(id);
    if (!foundCategory) throw notFound('Category not found');
    const currentTitle = foundCategory.title;
    if (title !== currentTitle) {
      const duplicateCategory = await Category.findOne({ where: { title } });
      if (duplicateCategory) throw badRequest('This category already exists');
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
    if (affectedRows === 0) throw badRequest('Category is not updated');
    return {
      id: updatedCategory.id,
      title: updatedCategory.title,
      description: updatedCategory.description || '',
    };
  }

  async deleteCategory(categoryId, transaction) {
    const foundCategory = await Category.findByPk(categoryId);
    if (!foundCategory) throw notFound('Category not found');
    const deletedCategory = await Category.destroy({
      where: { id: categoryId },
      transaction,
    });
    if (!deletedCategory) throw badRequest('Category is not deleted');
    return deletedCategory;
  }
}

module.exports = new CategoryService();
