const { Category } = require('../db/dbPostgres/models');
const {
  formatDate,
  checkPermission,
  mapStatus,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

const formatCategoryData = (category) => ({
  id: category.id,
  title: category.title,
  status: mapStatus(category.status),
  moderation: {
    moderatorId: category.moderatorId || '',
    moderatorFullName: category.moderatorFullName || '',
  },
  creation: {
    creatorId: category.creatorId || '',
    creatorFullName: category.creatorFullName || '',
    createdAt: formatDate(category.createdAt),
    updatedAt: formatDate(category.updatedAt),
  },
});

class CategoryService {
  async getAllCategories(status, limit, offset, sort = 'id', order = 'asc') {
    const foundCategories = await Category.findAll({
      attributes: ['id', 'title'],
      where: { status },
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundCategories.length) throw notFound('Категорії не знайдено');
    const total = await Category.count({ where: { status } });
    return {
      allCategories: foundCategories.map(({ id, title }) => ({ id, title })),
      total,
    };
  }

  async getCategoryById(categoryId) {
    const foundCategory = await Category.findByPk(categoryId);
    if (!foundCategory) throw notFound('Категорію не знайдено');
    return formatCategoryData(foundCategory.toJSON());
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
    if (!canAddCategories && !canManageCategories)
      throw forbidden('Ви не маєте дозволу на створення категорій');
    if (await Category.findOne({ where: { title } }))
      throw badRequest('Ця категорія вже існує');
    const newCategory = await Category.create(
      {
        title,
        status: canManageCategories ? 'approved' : 'pending',
        moderatorId: canManageCategories ? currentUser.id.toString() : null,
        moderatorFullName: canManageCategories ? currentUser.fullName : null,
        creatorId: currentUser.id.toString(),
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newCategory) throw badRequest('Дані цієї категорії не створено');
    return formatCategoryData(newCategory);
  }

  async updateCategory(id, title, currentUser, transaction) {
    const foundCategory = await Category.findByPk(id);
    if (!foundCategory) throw notFound('Категорію не знайдено');
    const isOwner = currentUser.id.toString() === foundCategory.creatorId;
    const canManageCategories = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!isOwner && !canManageCategories)
      throw forbidden('Ви не маєте дозволу на редагування цієї категорії');
    if (title !== foundCategory.title) {
      const duplicateCategory = await Category.findOne({ where: { title } });
      if (duplicateCategory) throw badRequest('Ця категорія вже існує');
    }
    const updateData = {
      title,
      status: canManageCategories ? 'approved' : 'pending',
      moderatorId: canManageCategories ? currentUser.id.toString() : null,
      moderatorFullName: canManageCategories ? currentUser.fullName : null,
    };
    const [affectedRows, [updatedCategory]] = await Category.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Дані цієї категорії не оновлено');
    return formatCategoryData(updatedCategory);
  }

  async updateCategoryStatus(id, status, currentUser, transaction) {
    const hasPermission = await checkPermission(
      currentUser,
      'MODERATE_CATEGORIES'
    );
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на модерацію категорій');
    const foundCategory = await Category.findByPk(id);
    if (!foundCategory) throw notFound('Категорію не знайдено');
    if (!['approved', 'rejected'].includes(status))
      throw notFound('Статус не знайдено');
    const updateData = {
      status,
      moderatorId: currentUser.id.toString(),
      moderatorFullName: currentUser.fullName,
    };
    const [affectedRows, [moderatedCategory]] = await Category.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Категорія не проходить модерацію');
    return formatCategoryData(moderatedCategory);
  }

  async deleteCategory(categoryId, currentUser, transaction) {
    const canManageCategories = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!canManageCategories)
      throw forbidden('Ви не маєте дозволу на видалення цієї категорії');
    const foundCategory = await Category.findByPk(categoryId);
    if (!foundCategory) throw notFound('Категорію не знайдено');
    const deletedCategory = await Category.destroy({
      where: { id: categoryId },
      transaction,
    });
    if (!deletedCategory) throw badRequest('Дані цієї категорії не видалено');
    return deletedCategory;
  }
}

module.exports = new CategoryService();
