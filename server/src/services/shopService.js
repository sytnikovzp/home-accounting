const { Shop } = require('../db/dbPostgres/models');
const {
  formatDateTime,
  isValidUUID,
  checkPermission,
  mapStatus,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/generalErrors');

const formatShopData = (shop) => ({
  uuid: shop.uuid,
  title: shop.title,
  description: shop.description || '',
  url: shop.url || '',
  logo: shop.logo || '',
  status: mapStatus(shop.status),
  moderation: {
    moderatorUuid: shop.moderatorUuid || '',
    moderatorFullName: shop.moderatorFullName || '',
  },
  creation: {
    creatorUuid: shop.creatorUuid || '',
    creatorFullName: shop.creatorFullName || '',
    createdAt: formatDateTime(shop.createdAt),
    updatedAt: formatDateTime(shop.updatedAt),
  },
});

class ShopService {
  async getAllShops(status, limit, offset, sort, order) {
    const foundShops = await Shop.findAll({
      attributes: ['uuid', 'title', 'logo'],
      where: { status },
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundShops.length) throw notFound('Магазини не знайдені');
    const total = await Shop.count({ where: { status } });
    return {
      allShops: foundShops,
      total,
    };
  }

  async getShopByUuid(uuid) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundShop = await Shop.findOne({ where: { uuid } });
    if (!foundShop) throw notFound('Магазин не знайдено');
    return formatShopData(foundShop.toJSON());
  }

  async createShop(title, description, url, currentUser, transaction) {
    const canAddShops = await checkPermission(currentUser, 'ADD_SHOPS');
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!canAddShops && !canManageShops)
      throw forbidden('Ви не маєте дозволу на створення магазинів');
    if (await Shop.findOne({ where: { title } }))
      throw badRequest('Цей магазин вже існує');
    if (await Shop.findOne({ where: { url } }))
      throw badRequest('Цей URL вже використовується');
    const newShop = await Shop.create(
      {
        title,
        description: description || null,
        url: url || null,
        status: canManageShops ? 'approved' : 'pending',
        moderatorUuid: canManageShops ? currentUser.uuid : null,
        moderatorFullName: canManageShops ? currentUser.fullName : null,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newShop) throw badRequest('Дані цього магазину не створено');
    return formatShopData(newShop);
  }

  async updateShop(uuid, title, description, url, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundShop = await Shop.findOne({ where: { uuid } });
    if (!foundShop) throw notFound('Магазин не знайдено');
    const isOwner = currentUser.uuid === foundShop.creatorUuid;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isOwner && !canManageShops)
      throw forbidden('Ви не маєте дозволу на редагування цього магазину');
    if (title && title !== foundShop.title) {
      const duplicateShop = await Shop.findOne({ where: { title } });
      if (duplicateShop) throw badRequest('Цей магазин вже існує');
    }
    if (url && url !== foundShop.url) {
      const duplicateUrl = await Shop.findOne({ where: { url } });
      if (duplicateUrl) throw badRequest('Цей URL вже використовується');
    }
    const [affectedRows, [updatedShop]] = await Shop.update(
      {
        title,
        description: description || null,
        url: url || null,
        status: canManageShops ? 'approved' : 'pending',
        moderatorUuid: canManageShops ? currentUser.uuid : null,
        moderatorFullName: canManageShops ? currentUser.fullName : null,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Дані цього магазину не оновлено');
    return formatShopData(updatedShop);
  }

  async updateShopLogo(uuid, filename, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    if (!filename) throw badRequest('Файл не завантажено');
    const foundShop = await Shop.findOne({ where: { uuid } });
    if (!foundShop) throw notFound('Магазин не знайдено');
    const isOwner = currentUser.uuid === foundShop.creatorUuid;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isOwner && !canManageShops)
      throw forbidden(
        'Ви не маєте дозволу на оновлення логотипу цього магазину'
      );
    const [affectedRows, [updatedShopLogo]] = await Shop.update(
      {
        logo: filename,
        status: canManageShops ? 'approved' : 'pending',
        moderatorUuid: canManageShops ? currentUser.uuid : null,
        moderatorFullName: canManageShops ? currentUser.fullName : null,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Логотип магазину не оновлено');
    return formatShopData(updatedShopLogo);
  }

  async removeShopLogo(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundShop = await Shop.findOne({ where: { uuid } });
    if (!foundShop) throw notFound('Магазин не знайдено');
    const isOwner = currentUser.uuid === foundShop.creatorUuid;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isOwner && !canManageShops)
      throw forbidden(
        'Ви не маєте дозволу на видалення логотипу цього магазину'
      );
    const [affectedRows, [removedShopLogo]] = await Shop.update(
      {
        logo: null,
        status: canManageShops ? 'approved' : 'pending',
        moderatorUuid: canManageShops ? currentUser.uuid : null,
        moderatorFullName: canManageShops ? currentUser.fullName : null,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Логотип магазину не видалено');
    return formatShopData(removedShopLogo);
  }

  async updateShopStatus(uuid, status, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    if (!['approved', 'rejected'].includes(status))
      throw badRequest('Недопустимий статус');
    const hasPermission = await checkPermission(currentUser, 'MODERATE_SHOPS');
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
    return formatShopData(moderatedCategory);
  }

  async deleteShop(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!canManageShops)
      throw forbidden('Ви не маєте дозволу на видалення цього магазину');
    const foundShop = await Shop.findOne({ where: { uuid } });
    if (!foundShop) throw notFound('Магазин не знайдено');
    const deletedShop = await Shop.destroy({ where: { uuid }, transaction });
    if (!deletedShop) throw badRequest('Дані цього магазину не видалено');
    return deletedShop;
  }
}

module.exports = new ShopService();
