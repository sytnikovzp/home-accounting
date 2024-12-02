const { Category } = require('../db/dbPostgres/models');
const { formatDate, checkPermission } = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

class CategoryService {
  async getAllCategories(status, limit, offset, sort, order) {
    const foundCategories = await Category.findAll({
      attributes: ['id', 'title'],
      where: { status },
      order: [[sort || 'id', order || 'asc']],
      raw: true,
      limit,
      offset,
    });
    if (foundCategories.length === 0) throw notFound('Категорії не знайдено');
    const allCategories = foundCategories.map((category) => ({
      id: category.id,
      title: category.title,
    }));
    const total = await Category.count({
      where: { status },
    });
    return {
      allCategories,
      total,
    };
  }

  async getCategoryById(categoryId) {
    const foundCategory = await Category.findByPk(categoryId);
    if (!foundCategory) throw notFound('Категорія не знайдена');
    const categoryData = foundCategory.toJSON();
    const statusMapping = {
      approved: 'Затверджено',
      pending: 'Очікує модерації',
      rejected: 'Відхилено',
    };
    return {
      id: categoryData.id,
      title: categoryData.title,
      status: statusMapping[categoryData.status] || categoryData.status,
      reviewedBy: categoryData.reviewedBy || '',
      reviewedAt: categoryData.reviewedAt
        ? formatDate(categoryData.reviewedAt)
        : '',
      createdBy: categoryData.createdBy || '',
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
      throw forbidden('Ви не маєте дозволу на модерацію категорій');
    }
    const foundCategory = await Category.findByPk(id);
    if (!foundCategory) throw notFound('Категорія не знайдена');
    if (!['approved', 'rejected'].includes(status)) {
      throw notFound('Статус не знайдено');
    }
    const currentUserId = currentUser.id.toString();
    const updateData = { status };
    updateData.reviewedBy = currentUserId;
    updateData.reviewedAt = new Date();
    const [affectedRows, [moderatedCategory]] = await Category.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (affectedRows === 0)
      throw badRequest('Категорія не проходить модерацію');
    return {
      id: moderatedCategory.id,
      title: moderatedCategory.title,
      status: moderatedCategory.status,
      reviewedBy: moderatedCategory.reviewedBy,
      reviewedAt: formatDate(moderatedCategory.reviewedAt),
      createdBy: moderatedCategory.createdBy || '',
    };
  }

  async createCategory(title, currentUser, transaction) {
    const canAddCategories = await checkPermission(
      currentUser,
      'ADD_CATEGORIES'
    );
    const canManageCategories = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!canAddCategories && !canManageCategories) {
      throw forbidden('Ви не маєте дозволу на створення категорій');
    }
    const duplicateCategory = await Category.findOne({ where: { title } });
    if (duplicateCategory) throw badRequest('Ця категорія вже існує');
    const currentUserId = currentUser.id.toString();
    const status = canManageCategories ? 'approved' : 'pending';
    const reviewedBy = canManageCategories ? currentUserId : null;
    const reviewedAt = canManageCategories ? new Date() : null;
    const createdBy = currentUserId;
    const newCategory = await Category.create(
      {
        title,
        status,
        reviewedBy,
        reviewedAt,
        createdBy,
      },
      { transaction, returning: true }
    );
    if (!newCategory) throw badRequest('Дані цієї категорії не створено');
    return {
      id: newCategory.id,
      title: newCategory.title,
      status: newCategory.status,
      reviewedBy: newCategory.reviewedBy || '',
      reviewedAt: newCategory.reviewedAt
        ? formatDate(newCategory.reviewedAt)
        : '',
      createdBy: newCategory.createdBy || '',
    };
  }

  async updateCategory(id, title, currentUser, transaction) {
    const foundCategory = await Category.findByPk(id);
    if (!foundCategory) throw notFound('Категорія не знайдена');
    const isCategoryOwner =
      currentUser.id.toString() === foundCategory.createdBy;
    const canManageCategories = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!isCategoryOwner && !canManageCategories) {
      throw forbidden('Ви не маєте дозволу на редагування цієї категорії');
    }
    const currentTitle = foundCategory.title;
    if (title !== currentTitle) {
      const duplicateCategory = await Category.findOne({ where: { title } });
      if (duplicateCategory) throw badRequest('Ця категорія вже існує');
    } else {
      title = currentTitle;
    }
    const updateData = { title };
    const currentUserId = currentUser.id.toString();
    updateData.status = canManageCategories ? 'approved' : 'pending';
    updateData.reviewedBy = canManageCategories ? currentUserId : null;
    updateData.reviewedAt = canManageCategories ? new Date() : null;
    const [affectedRows, [updatedCategory]] = await Category.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (affectedRows === 0) throw badRequest('Дані цієї категорії не оновлено');
    return {
      id: updatedCategory.id,
      title: updatedCategory.title,
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
      throw forbidden('Ви не маєте дозволу на видалення цієї категорії');
    const foundCategory = await Category.findByPk(categoryId);
    if (!foundCategory) throw notFound('Категорія не знайдена');
    const deletedCategory = await Category.destroy({
      where: { id: categoryId },
      transaction,
    });
    if (!deletedCategory) throw badRequest('Дані цієї категорії не видалено');
    return deletedCategory;
  }
}

module.exports = new CategoryService();
