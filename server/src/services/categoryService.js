const { format } = require('date-fns');
// ==============================================================
const { Category } = require('../db/dbPostgres/models');
// ==============================================================
const { notFound, badRequest } = require('../errors/customErrors');

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
      createdAt: format(
        new Date(categoryData.createdAt),
        'dd MMMM yyyy, HH:mm'
      ),
      updatedAt: format(
        new Date(categoryData.updatedAt),
        'dd MMMM yyyy, HH:mm'
      ),
    };
  }

  async createCategory(title, descriptionValue) {
    const existingCategory = await Category.findOne({ where: { title } });
    if (existingCategory) {
      throw badRequest('This category is already exists');
    }
    const description = descriptionValue === '' ? null : descriptionValue;
    const newCategory = await Category.create({ title, description });
    return {
      id: newCategory.id,
      title: newCategory.title,
      description: newCategory.description || '',
      createdAt: format(new Date(newCategory.createdAt), 'dd MMMM yyyy, HH:mm'),
      updatedAt: format(new Date(newCategory.updatedAt), 'dd MMMM yyyy, HH:mm'),
    };
  }

  async updateCategory(id, title, descriptionValue) {
    const categoryById = await Category.findByPk(id);
    if (!categoryById) {
      throw notFound('Category not found');
    }
    const updateData = { title };
    if (descriptionValue !== undefined) {
      const description = descriptionValue === '' ? null : descriptionValue;
      updateData.description = description;
    }
    const [affectedRows, [updatedCategory]] = await Category.update(
      updateData,
      {
        where: { id },
        returning: true,
      }
    );
    if (affectedRows === 0) {
      throw badRequest('Category is not updated');
    }
    return {
      id: updatedCategory.id,
      title: updatedCategory.title,
      description: updatedCategory.description || '',
      createdAt: format(
        new Date(updatedCategory.createdAt),
        'dd MMMM yyyy, HH:mm'
      ),
      updatedAt: format(
        new Date(updatedCategory.updatedAt),
        'dd MMMM yyyy, HH:mm'
      ),
    };
  }

  async deleteCategory(categoryId) {
    const categoryById = await Category.findByPk(categoryId);
    if (!categoryById) {
      throw notFound('Category not found');
    }
    const deleteCategory = await Category.destroy({
      where: { id: categoryId },
    });
    if (!deleteCategory) {
      throw badRequest('Category is not deleted');
    }
    return deleteCategory;
  }
}

module.exports = new CategoryService();
