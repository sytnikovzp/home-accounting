const { Category, Product, Establishment } = require('../db/dbPostgres/models');

const { statusModerationMapping } = require('../constants/dataMapping');
const { notFound, badRequest, forbidden } = require('../errors/generalErrors');
const {
  isValidUUID,
  checkPermission,
  mapValue,
  formatDateTime,
} = require('../utils/sharedFunctions');

const entityModels = {
  categories: Category,
  products: Product,
  establishments: Establishment,
};

const formatAllEntitiesData = {
  categories: (category) => ({
    uuid: category.uuid,
    title: category.title,
    contentType: 'Категорія',
    path: 'category',
  }),
  products: (product) => ({
    uuid: product.uuid,
    title: product.title,
    contentType: 'Товар',
    path: 'product',
  }),
  establishments: (establishment) => ({
    uuid: establishment.uuid,
    title: establishment.title,
    contentType: 'Заклад',
    path: 'establishment',
  }),
};

const formatEntityData = (entity) => ({
  uuid: entity.uuid,
  title: entity.title,
  status: mapValue(entity.status, statusModerationMapping),
  moderation: {
    moderatorUuid: entity.moderatorUuid || '',
    moderatorFullName: entity.moderatorFullName || '',
  },
  creation: {
    creatorUuid: entity.creatorUuid || '',
    creatorFullName: entity.creatorFullName || '',
    createdAt: formatDateTime(entity.createdAt),
    updatedAt: formatDateTime(entity.updatedAt),
  },
});

class ModerationsService {
  static async getPendingItemsFromAllEntities(limit, offset, sort, order) {
    const pendingStatus = 'pending';
    let total = 0;
    const allItems = [];
    const entityPromises = Object.entries(entityModels).map(
      async ([entity, Model]) => {
        const foundItems = await Model.findAll({
          where: { status: pendingStatus },
          raw: true,
        });
        const formattedItems = foundItems.map(formatAllEntitiesData[entity]);
        allItems.push(...formattedItems);
        return Model.count({ where: { status: pendingStatus } });
      }
    );
    const entityCounts = await Promise.all(entityPromises);
    total = entityCounts.reduce((acc, count) => acc + count, 0);
    allItems.sort((a, b) => {
      switch (order) {
        case 'asc':
          if (a[sort] > b[sort]) {
            return 1;
          }
          if (a[sort] < b[sort]) {
            return -1;
          }
          return 0;
        default:
          if (a[sort] < b[sort]) {
            return 1;
          }
          if (a[sort] > b[sort]) {
            return -1;
          }
          return 0;
      }
    });
    const paginatedItems = allItems.slice(offset, offset + limit);
    if (!paginatedItems.length) {
      throw notFound('Елементи не знайдено');
    }
    return { allItems: paginatedItems, total };
  }

  static async updateCategoryStatus(uuid, status, currentUser, transaction) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    if (!['approved', 'rejected'].includes(status)) {
      throw badRequest('Недопустимий статус');
    }
    const hasPermission = await checkPermission(
      currentUser,
      'MODERATION_CATEGORIES'
    );
    if (!hasPermission) {
      throw forbidden('Ви не маєте дозволу на модерацію категорій');
    }
    const foundCategory = await Category.findOne({ where: { uuid } });
    if (!foundCategory) {
      throw notFound('Категорію не знайдено');
    }
    const [affectedRows, [moderatedCategory]] = await Category.update(
      {
        status,
        moderatorUuid: currentUser.uuid,
        moderatorFullName: currentUser.fullName,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) {
      throw badRequest('Категорія не проходить модерацію');
    }
    return formatEntityData(moderatedCategory);
  }

  static async updateProductStatus(uuid, status, currentUser, transaction) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    if (!['approved', 'rejected'].includes(status)) {
      throw badRequest('Недопустимий статус');
    }
    const hasPermission = await checkPermission(
      currentUser,
      'MODERATION_PRODUCTS'
    );
    if (!hasPermission) {
      throw forbidden('Ви не маєте дозволу на модерацію товарів');
    }
    const foundProduct = await Product.findOne({ where: { uuid } });
    if (!foundProduct) {
      throw notFound('Товар не знайдено');
    }
    const [affectedRows, [moderatedProduct]] = await Product.update(
      {
        status,
        moderatorUuid: currentUser.uuid,
        moderatorFullName: currentUser.fullName,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) {
      throw badRequest('Товар не проходить модерацію');
    }
    return formatEntityData(moderatedProduct);
  }

  static async updateEstablishmentStatus(
    uuid,
    status,
    currentUser,
    transaction
  ) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    if (!['approved', 'rejected'].includes(status)) {
      throw badRequest('Недопустимий статус');
    }
    const hasPermission = await checkPermission(
      currentUser,
      'MODERATION_ESTABLISHMENTS'
    );
    if (!hasPermission) {
      throw forbidden('Ви не маєте дозволу на модерацію закладів');
    }
    const foundEstablishment = await Establishment.findOne({ where: { uuid } });
    if (!foundEstablishment) {
      throw notFound('Заклад не знайдено');
    }
    const [affectedRows, [moderatedCategory]] = await Establishment.update(
      {
        status,
        moderatorUuid: currentUser.uuid,
        moderatorFullName: currentUser.fullName,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) {
      throw badRequest('Заклад не проходить модерацію');
    }
    return formatEntityData(moderatedCategory);
  }
}

module.exports = ModerationsService;
