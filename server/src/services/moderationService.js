const { Category, Product, Shop } = require('../db/dbPostgres/models');
const {
  isValidUUID,
  checkPermission,
  mapValue,
  formatDateTime,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/generalErrors');
const { statusModerationMapping } = require('../constants/dataMapping');

const entityModels = {
  categories: Category,
  products: Product,
  shops: Shop,
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
  shops: (shop) => ({
    uuid: shop.uuid,
    title: shop.title,
    contentType: 'Магазин',
    path: 'shop',
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

class ModerationService {
  async getPendingItemsFromAllEntities(limit, offset, sort, order) {
    const pendingStatus = 'pending';
    let total = 0;
    const allItems = [];
    for (const [entity, Model] of Object.entries(entityModels)) {
      const foundItems = await Model.findAll({
        where: { status: pendingStatus },
        raw: true,
      });
      total += await Model.count({ where: { status: pendingStatus } });
      const formattedItems = foundItems.map(formatAllEntitiesData[entity]);
      allItems.push(...formattedItems);
    }
    allItems.sort((a, b) => {
      if (order === 'asc') {
        return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
      } else {
        return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
      }
    });
    const paginatedItems = allItems.slice(offset, offset + limit);
    if (!paginatedItems.length) throw notFound('Елементи не знайдено');
    return { allItems: paginatedItems, total };
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
    return formatEntityData(moderatedCategory);
  }

  async updateProductStatus(uuid, status, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    if (!['approved', 'rejected'].includes(status))
      throw badRequest('Недопустимий статус');
    const hasPermission = await checkPermission(
      currentUser,
      'MODERATION_PRODUCTS'
    );
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на модерацію товарів');
    const foundProduct = await Product.findOne({ where: { uuid } });
    if (!foundProduct) throw notFound('Товар не знайдено');
    const [affectedRows, [moderatedProduct]] = await Product.update(
      {
        status,
        moderatorUuid: currentUser.uuid,
        moderatorFullName: currentUser.fullName,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Товар не проходить модерацію');
    return formatEntityData(moderatedProduct);
  }

  async updateShopStatus(uuid, status, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    if (!['approved', 'rejected'].includes(status))
      throw badRequest('Недопустимий статус');
    const hasPermission = await checkPermission(
      currentUser,
      'MODERATION_SHOPS'
    );
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на модерацію магазинів');
    const foundShop = await Shop.findOne({ where: { uuid } });
    if (!foundShop) throw notFound('Магазин не знайдено');
    const [affectedRows, [moderatedCategory]] = await Shop.update(
      {
        status,
        moderatorUuid: currentUser.uuid,
        moderatorFullName: currentUser.fullName,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Магазин не проходить модерацію');
    return formatEntityData(moderatedCategory);
  }
}

module.exports = new ModerationService();
