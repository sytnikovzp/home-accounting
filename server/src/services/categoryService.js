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
      id: categoryData.id,
      title: categoryData.title,
      description: categoryData.description || '',
      status: categoryData.status,
      reviewedBy: categoryData.reviewedBy || '',
      reviewedAt: categoryData.reviewedAt
        ? formatDate(categoryData.reviewedAt)
        : '',
      createdBy: categoryData.createdBy || '',
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
    if (!['approved', 'rejected'].includes(status)) {
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
    const canAddCategories = await checkPermission(
      currentUser,
      'ADD_CATEGORIES'
    );
    const canManageCategories = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!canAddCategories && !canManageCategories) {
      throw forbidden('You don`t have permission to create categories');
    }
    const duplicateCategory = await Category.findOne({ where: { title } });
    if (duplicateCategory) throw badRequest('This category already exists');
    const description = descriptionValue === '' ? null : descriptionValue;
    const currentUserId = currentUser.id.toString();
    const status = canManageCategories ? 'approved' : 'pending';
    const reviewedBy = canManageCategories ? currentUserId : null;
    const reviewedAt = canManageCategories ? new Date() : null;
    const createdBy = currentUserId;
    const newCategory = await Category.create(
      {
        title,
        description,
        status,
        reviewedBy,
        reviewedAt,
        createdBy,
      },
      { transaction, returning: true }
    );
    if (!newCategory) throw badRequest('Category is not created');
    return {
      id: newCategory.id,
      title: newCategory.title,
      description: newCategory.description || '',
      status: newCategory.status,
      reviewedBy: newCategory.reviewedBy || '',
      reviewedAt: newCategory.reviewedAt
        ? formatDate(newCategory.reviewedAt)
        : '',
      createdBy: newCategory.createdBy || '',
    };
  }

  async updateCategory(id, title, descriptionValue, currentUser, transaction) {
    const foundCategory = await Category.findByPk(id);
    if (!foundCategory) throw notFound('Category not found');
    const isCategoryOwner =
      currentUser.id.toString() === foundCategory.createdBy;
    const canManageCategories = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!isCategoryOwner && !canManageCategories) {
      throw forbidden('You don`t have permission to edit this category');
    }
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
    const currentUserId = currentUser.id.toString();
    updateData.status = canManageCategories ? 'approved' : 'pending';
    updateData.reviewedBy = canManageCategories ? currentUserId : null;
    updateData.reviewedAt = canManageCategories ? new Date() : null;
    const [affectedRows, [updatedCategory]] = await Category.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (affectedRows === 0) throw badRequest('Category is not updated');
    return {
      id: updatedCategory.id,
      title: updatedCategory.title,
      description: updatedCategory.description || '',
      status: updatedCategory.status,
      reviewedBy: updatedCategory.reviewedBy || '',
      reviewedAt: updatedCategory.reviewedAt
        ? formatDate(updatedCategory.reviewedAt)
        : '',
      createdBy: updatedCategory.createdBy || '',
    };
  }

  async deleteCategory(categoryId, currentUser, transaction) {
    const hasPermission = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!hasPermission)
      throw forbidden('You don`t have permission to delete this category');
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
