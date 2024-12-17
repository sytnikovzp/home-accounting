const { Category } = require('../db/dbPostgres/models');
const {
  dataMapping: { statusModerationMapping },
} = require('../constants');
const {
  formatDateTime,
  isValidUUID,
  checkPermission,
  mapValue,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/generalErrors');

const formatCategoryData = (category) => ({
  uuid: category.uuid,
  title: category.title,
  status: mapValue(category.status, statusModerationMapping),
  moderation: {
    moderatorUuid: category.moderatorUuid || '',
    moderatorFullName: category.moderatorFullName || '',
  },
  creation: {
    creatorUuid: category.creatorUuid || '',
    creatorFullName: category.creatorFullName || '',
    createdAt: formatDateTime(category.createdAt),
    updatedAt: formatDateTime(category.updatedAt),
  },
});

class CategoryService {
  async getAllCategories(status, limit, offset, sort, order) {
    const foundCategories = await Category.findAll({
      attributes: ['uuid', 'title'],
      where: { status },
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundCategories.length) throw notFound('Категорії не знайдено');
    const total = await Category.count({ where: { status } });
    return {
      allCategories: foundCategories,
      total,
    };
  }

  async getCategoryByUuid(uuid) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundCategory = await Category.findOne({ where: { uuid } });
    if (!foundCategory) throw notFound('Категорію не знайдено');
    return formatCategoryData(foundCategory);
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
        moderatorUuid: canManageCategories ? currentUser.uuid : null,
        moderatorFullName: canManageCategories ? currentUser.fullName : null,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newCategory) throw badRequest('Дані цієї категорії не створено');
    return formatCategoryData(newCategory);
  }

  async updateCategory(uuid, title, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundCategory = await Category.findOne({ where: { uuid } });
    if (!foundCategory) throw notFound('Категорію не знайдено');
    const isOwner = currentUser.uuid === foundCategory.creatorUuid;
    const canManageCategories = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!isOwner && !canManageCategories)
      throw forbidden('Ви не маєте дозволу на редагування цієї категорії');
    if (title && title !== foundCategory.title) {
      const duplicateCategory = await Category.findOne({ where: { title } });
      if (duplicateCategory) throw badRequest('Ця категорія вже існує');
    }
    const [affectedRows, [updatedCategory]] = await Category.update(
      {
        title,
        status: canManageCategories ? 'approved' : 'pending',
        moderatorUuid: canManageCategories ? currentUser.uuid : null,
        moderatorFullName: canManageCategories ? currentUser.fullName : null,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Дані цієї категорії не оновлено');
    return formatCategoryData(updatedCategory);
  }

  async updateCategoryStatus(uuid, status, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    if (!['approved', 'rejected'].includes(status))
      throw badRequest('Недопустимий статус');
    const hasPermission = await checkPermission(
      currentUser,
      'MODERATION_CATEGORIES'
    );
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на модерацію категорій');
    const foundCategory = await Category.findOne({ where: { uuid } });
    if (!foundCategory) throw notFound('Категорію не знайдено');
    const [affectedRows, [moderatedCategory]] = await Category.update(
      {
        status,
        moderatorUuid: currentUser.uuid,
        moderatorFullName: currentUser.fullName,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Категорія не проходить модерацію');
    return formatCategoryData(moderatedCategory);
  }

  async deleteCategory(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const canManageCategories = await checkPermission(
      currentUser,
      'MANAGE_CATEGORIES'
    );
    if (!canManageCategories)
      throw forbidden('Ви не маєте дозволу на видалення цієї категорії');
    const foundCategory = await Category.findOne({ where: { uuid } });
    if (!foundCategory) throw notFound('Категорію не знайдено');
    const deletedCategory = await Category.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedCategory) throw badRequest('Дані цієї категорії не видалено');
    return deletedCategory;
  }
}

module.exports = new CategoryService();
