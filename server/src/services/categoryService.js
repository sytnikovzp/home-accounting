const { Category } = require('../db/dbPostgres/models');
const { notFound, badRequest } = require('../errors/customErrors');
const { formatDate } = require('../utils/sharedFunctions');

class CategoryService {
  async getAllCategories() {
    const findCategories = await Category.findAll({
      attributes: ['id', 'title'],
      raw: true,
    });
    if (findCategories.length === 0) throw notFound('Categories not found');
    return findCategories;
  }

  async getCategoryById(categoryId) {
    const findCategory = await Category.findByPk(categoryId);
    if (!findCategory) throw notFound('Category not found');
    const categoryData = findCategory.toJSON();
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
    const findCategory = await Category.findByPk(id);
    if (!findCategory) throw notFound('Category not found');
    const currentTitle = findCategory.title;
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
    const findCategory = await Category.findByPk(categoryId);
    if (!findCategory) throw notFound('Category not found');
    const deletedCategory = await Category.destroy({
      where: { id: categoryId },
      transaction,
    });
    if (!deletedCategory) throw badRequest('Category is not deleted');
    return deletedCategory;
  }
}

module.exports = new CategoryService();
