const { Shop } = require('../db/dbPostgres/models');
const {
  formatDate,
  checkPermission,
  mapStatus,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

const formatShopData = (shop) => ({
  id: shop.id,
  title: shop.title,
  description: shop.description || '',
  url: shop.url || '',
  logo: shop.logo || '',
  status: mapStatus(shop.status),
  moderation: {
    moderatorId: shop.moderatorId || '',
    moderatorFullName: shop.moderatorFullName || '',
  },
  creation: {
    creatorId: shop.creatorId || '',
    creatorFullName: shop.creatorFullName || '',
    createdAt: formatDate(shop.createdAt),
    updatedAt: formatDate(shop.updatedAt),
  },
});

class ShopService {
  async getAllShops(status, limit, offset, sort = 'id', order = 'asc') {
    const foundShops = await Shop.findAll({
      attributes: ['id', 'title', 'url', 'logo'],
      where: { status },
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundShops.length) throw notFound('Магазини не знайдені');
    const total = await Shop.count({ where: { status } });
    return {
      allShops: foundShops.map(({ id, title, url, logo }) => ({
        id,
        title,
        url,
        logo,
      })),
      total,
    };
  }

  async getShopById(shopId) {
    const foundShop = await Shop.findByPk(shopId);
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
        moderatorId: canManageShops ? currentUser.id.toString() : null,
        moderatorFullName: canManageShops ? currentUser.fullName : null,
        creatorId: currentUser.id.toString(),
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newShop) throw badRequest('Дані цього магазину не створено');
    return formatShopData(newShop);
  }

  async updateShop(id, title, description, url, currentUser, transaction) {
    const foundShop = await Shop.findByPk(id);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const isOwner = currentUser.id.toString() === foundShop.creatorId;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isOwner && !canManageShops)
      throw forbidden('Ви не маєте дозволу на редагування цього магазину');
    if (title !== foundShop.title) {
      const duplicateShop = await Shop.findOne({ where: { title } });
      if (duplicateShop) throw badRequest('Цей магазин вже існує');
    }
    if (url !== foundShop.url) {
      const duplicateUrl = await Shop.findOne({ where: { url } });
      if (duplicateUrl) throw badRequest('Цей URL вже використовується');
    }
    const updateData = {
      title,
      description: description || null,
      url: url || null,
      status: canManageShops ? 'approved' : 'pending',
      moderatorId: canManageShops ? currentUser.id.toString() : null,
      moderatorFullName: canManageShops ? currentUser.fullName : null,
    };
    const [affectedRows, [updatedShop]] = await Shop.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
    if (!affectedRows) throw badRequest('Дані цього магазину не оновлено');
    return formatShopData(updatedShop);
  }

  async updateShopLogo(id, filename, currentUser, transaction) {
    if (!filename) throw badRequest('Файл не завантажено');
    const foundShop = await Shop.findByPk(id);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const isOwner = currentUser.id.toString() === foundShop.creatorId;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isOwner && !canManageShops)
      throw forbidden(
        'Ви не маєте дозволу на оновлення логотипу цього магазину'
      );
    const updateData = {
      logo: filename,
      status: canManageShops ? 'approved' : 'pending',
      moderatorId: canManageShops ? currentUser.id.toString() : null,
      moderatorFullName: canManageShops ? currentUser.fullName : null,
    };
    const [affectedRows, [updatedShopLogo]] = await Shop.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
    if (!affectedRows) throw badRequest('Логотип магазину не оновлено');
    return formatShopData(updatedShopLogo);
  }

  async removeShopLogo(id, currentUser, transaction) {
    const foundShop = await Shop.findByPk(id);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const isOwner = currentUser.id.toString() === foundShop.creatorId;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isOwner && !canManageShops)
      throw forbidden(
        'Ви не маєте дозволу на видалення логотипу цього магазину'
      );
    const updateData = {
      logo: null,
      status: canManageShops ? 'approved' : 'pending',
      moderatorId: canManageShops ? currentUser.id.toString() : null,
      moderatorFullName: canManageShops ? currentUser.fullName : null,
    };
    const [affectedRows, [removedShopLogo]] = await Shop.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
    if (!affectedRows) throw badRequest('Логотип магазину не видалено');
    return formatShopData(removedShopLogo);
  }

  async updateShopStatus(id, status, currentUser, transaction) {
    const hasPermission = await checkPermission(currentUser, 'MODERATE_SHOPS');
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на модерацію магазинів');
    const foundShop = await Shop.findByPk(id);
    if (!foundShop) throw notFound('Магазин не знайдено');
    if (!['approved', 'rejected'].includes(status))
      throw notFound('Статус не знайдено');
    const updateData = {
      status,
      moderatorId: currentUser.id.toString(),
      moderatorFullName: currentUser.fullName,
    };
    const [affectedRows, [moderatedCategory]] = await Shop.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
    if (!affectedRows) throw badRequest('Магазин не проходить модерацію');
    return formatShopData(moderatedCategory);
  }

  async deleteShop(shopId, currentUser, transaction) {
    const hasPermission = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на видалення цього магазину');
    const foundShop = await Shop.findByPk(shopId);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const deletedShop = await Shop.destroy({
      where: { id: shopId },
      transaction,
    });
    if (!deletedShop) throw badRequest('Дані цього магазину не видалено');
    return deletedShop;
  }
}

module.exports = new ShopService();
