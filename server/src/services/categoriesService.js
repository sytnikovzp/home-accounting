const { Category } = require('../db/dbPostgres/models');

const {
  DATA_MAPPING: { STATUS_MODERATION_MAPPING },
} = require('../constants');
const { notFound, badRequest, forbidden } = require('../errors/generalErrors');
const { checkPermission } = require('../utils/authHelpers');
const { formatDateTime } = require('../utils/dateHelpers');
const { mapValue } = require('../utils/stringUtils');
const { isValidUUID } = require('../utils/validators');

const formatCategoryData = (category) => ({
  uuid: category.uuid,
  title: category.title,
  contentType: 'Категорія',
  status: mapValue(category.status, STATUS_MODERATION_MAPPING),
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

class CategoriesService {
  static async getAllCategories(status, limit, offset, sort, order) {
    const foundCategories = await Category.findAll({
      attributes: ['uuid', 'title'],
      where: { status },
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundCategories.length) {
      throw notFound('Категорії не знайдено');
    }
    const totalCount = await Category.count({ where: { status } });
    return {
      allCategories: foundCategories,
      totalCount,
    };
  }

  static async getCategoryByUuid(uuid) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundCategory = await Category.findByPk(uuid);
    if (!foundCategory) {
      throw notFound('Категорію не знайдено');
    }
    return formatCategoryData(foundCategory);
  }

  static async createCategory(title, currentUser, transaction) {
    if (await Category.findOne({ where: { title } })) {
      throw badRequest('Ця категорія вже існує');
    }
    const canAddCategories = await checkPermission(
      currentUser,
      'ADD_CATEGORIES'
    );
    const canModerationCategories = await checkPermission(
      currentUser,
      'MODERATION_CATEGORIES'
    );
    if (!canAddCategories) {
      throw forbidden('Ви не маєте дозволу на додавання категорій');
    }
    const newCategory = await Category.create(
      {
        title,
        status: canModerationCategories ? 'approved' : 'pending',
        moderatorUuid: canModerationCategories ? currentUser.uuid : null,
        moderatorFullName: canModerationCategories
          ? currentUser.fullName
          : null,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newCategory) {
      throw badRequest('Дані цієї категорії не створено');
    }
    return formatCategoryData(newCategory);
  }

  static async updateCategory(uuid, title, currentUser, transaction) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundCategory = await Category.findByPk(uuid);
    if (!foundCategory) {
      throw notFound('Категорію не знайдено');
    }
    const canEditCategories = await checkPermission(
      currentUser,
      'EDIT_CATEGORIES'
    );
    const canModerationCategories = await checkPermission(
      currentUser,
      'MODERATION_CATEGORIES'
    );
    if (!canEditCategories && !canModerationCategories) {
      throw forbidden('Ви не маєте дозволу на редагування цієї категорії');
    }
    if (title && title !== foundCategory.title) {
      const duplicateCategory = await Category.findOne({ where: { title } });
      if (duplicateCategory) {
        throw badRequest('Ця категорія вже існує');
      }
    }
    const [affectedRows, [updatedCategory]] = await Category.update(
      {
        title,
        status: canModerationCategories ? 'approved' : 'pending',
        moderatorUuid: canModerationCategories ? currentUser.uuid : null,
        moderatorFullName: canModerationCategories
          ? currentUser.fullName
          : null,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) {
      throw badRequest('Дані цієї категорії не оновлено');
    }
    return formatCategoryData(updatedCategory);
  }

  static async deleteCategory(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundCategory = await Category.findByPk(uuid);
    if (!foundCategory) {
      throw notFound('Категорію не знайдено');
    }
    const canRemoveCategories = await checkPermission(
      currentUser,
      'REMOVE_CATEGORIES'
    );
    if (!canRemoveCategories) {
      throw forbidden('Ви не маєте дозволу на видалення цієї категорії');
    }
    const deletedCategory = await Category.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedCategory) {
      throw badRequest('Дані цієї категорії не видалено');
    }
    return deletedCategory;
  }
}

module.exports = CategoriesService;
