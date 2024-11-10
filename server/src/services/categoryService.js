const { Category } = require('../db/dbPostgres/models');
const { formatDate, checkPermission } = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

class CategoryService {
  async getAllCategories(status) {
    const foundCategories = await Category.findAll({
      attributes: ['id', 'title'],
      where: { status },
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

  async updateCategoryStatus(id, status, currentUser, transaction) {
    const hasPermission = await checkPermission(
      currentUser,
      'MODERATE_CATEGORIES'
    );
    if (!hasPermission) {
      throw forbidden('You don`t have permission to moderate categories');
    }
    const foundCategory = await Category.findByPk(id);
    if (!foundCategory) throw notFound('Category not found');
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      throw notFound('Status not found');
    }
    const updateData = { status };
    const [affectedRows, [moderatedCategory]] = await Category.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (affectedRows === 0) throw badRequest('Category is not moderated');
    return {
      id: moderatedCategory.id,
      title: moderatedCategory.title,
      status: moderatedCategory.status,
    };
  }

  async createCategory(title, descriptionValue, currentUser, transaction) {
    const hasPermission = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!hasPermission)
      throw forbidden('You don`t have permission to create categories');
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

  async updateCategory(id, title, descriptionValue, currentUser, transaction) {
    const hasPermission = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!hasPermission)
      throw forbidden('You don`t have permission to edit categories');
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

  async deleteCategory(categoryId, currentUser, transaction) {
    const hasPermission = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!hasPermission)
      throw forbidden('You don`t have permission to delete categories');
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
