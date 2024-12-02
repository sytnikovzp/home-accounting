const { Shop } = require('../db/dbPostgres/models');
const { formatDate, checkPermission } = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

class ShopService {
  async getAllShops(status, limit, offset) {
    const foundShops = await Shop.findAll({
      attributes: ['id', 'title', 'url', 'logo'],
      where: { status },
      raw: true,
      limit,
      offset,
    });
    if (foundShops.length === 0) throw notFound('Магазини не знайдені');
    const allShops = foundShops.map((shop) => ({
      id: shop.id,
      title: shop.title,
      url: shop.url || '',
      logo: shop.logo || '',
    }));
    const total = await Shop.count({
      where: { status },
    });
    return {
      allShops,
      total,
    };
  }

  async getShopById(shopId) {
    const foundShop = await Shop.findByPk(shopId);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const shopData = foundShop.toJSON();
    const statusMapping = {
      approved: 'Затверджено',
      pending: 'Очікує модерації',
      rejected: 'Відхилено',
    };
    return {
      id: shopData.id,
      title: shopData.title,
      description: shopData.description || '',
      url: shopData.url || '',
      logo: shopData.logo || '',
      status: statusMapping[shopData.status] || shopData.status,
      reviewedBy: shopData.reviewedBy || '',
      reviewedAt: shopData.reviewedAt ? formatDate(shopData.reviewedAt) : '',
      createdBy: shopData.createdBy || '',
      createdAt: formatDate(shopData.createdAt),
      updatedAt: formatDate(shopData.updatedAt),
    };
  }

  async updateShopStatus(id, status, currentUser, transaction) {
    const hasPermission = await checkPermission(currentUser, 'MODERATE_SHOPS');
    if (!hasPermission) {
      throw forbidden('Ви не маєте дозволу на модерацію магазинів');
    }
    const foundShop = await Shop.findByPk(id);
    if (!foundShop) throw notFound('Магазин не знайдено');
    if (!['approved', 'rejected'].includes(status)) {
      throw notFound('Статус не знайдено');
    }
    const currentUserId = currentUser.id.toString();
    const updateData = { status };
    updateData.reviewedBy = currentUserId;
    updateData.reviewedAt = new Date();
    const [affectedRows, [moderatedShop]] = await Shop.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
    if (affectedRows === 0) throw badRequest('Магазин не проходить модерацію');
    return {
      id: moderatedShop.id,
      title: moderatedShop.title,
      status: moderatedShop.status,
      reviewedBy: moderatedShop.reviewedBy,
      reviewedAt: formatDate(moderatedShop.reviewedAt),
      createdBy: moderatedShop.createdBy || '',
    };
  }

  async createShop(
    title,
    descriptionValue,
    urlValue,
    currentUser,
    transaction
  ) {
    const canAddShops = await checkPermission(currentUser, 'ADD_SHOPS');
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!canAddShops && !canManageShops) {
      throw forbidden('Ви не маєте дозволу на створення магазинів');
    }
    const duplicateShop = await Shop.findOne({ where: { title } });
    if (duplicateShop) throw badRequest('Цей магазин вже існує');
    const description = descriptionValue === '' ? null : descriptionValue;
    const url = urlValue === '' ? null : urlValue;
    const currentUserId = currentUser.id.toString();
    const status = canManageShops ? 'approved' : 'pending';
    const reviewedBy = canManageShops ? currentUserId : null;
    const reviewedAt = canManageShops ? new Date() : null;
    const createdBy = currentUserId;
    const newShop = await Shop.create(
      {
        title,
        description,
        url,
        status,
        reviewedBy,
        reviewedAt,
        createdBy,
      },
      { transaction, returning: true }
    );
    if (!newShop) throw badRequest('Дані цього магазину не створено');
    return {
      id: newShop.id,
      title: newShop.title,
      description: newShop.description || '',
      url: newShop.url || '',
      status: newShop.status,
      reviewedBy: newShop.reviewedBy || '',
      reviewedAt: newShop.reviewedAt ? formatDate(newShop.reviewedAt) : '',
      createdBy: newShop.createdBy || '',
    };
  }

  async updateShop(
    id,
    title,
    descriptionValue,
    urlValue,
    currentUser,
    transaction
  ) {
    const foundShop = await Shop.findByPk(id);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const isShopOwner = currentUser.id.toString() === foundShop.createdBy;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isShopOwner && !canManageShops) {
      throw forbidden('Ви не маєте дозволу на редагування цього магазину');
    }
    const currentTitle = foundShop.title;
    if (title !== currentTitle) {
      const duplicateShop = await Shop.findOne({ where: { title } });
      if (duplicateShop) throw badRequest('Цей магазин вже існує');
    } else {
      title = currentTitle;
    }
    const updateData = { title };
    if (descriptionValue !== undefined) {
      const description = descriptionValue === '' ? null : descriptionValue;
      updateData.description = description;
    }
    if (urlValue !== undefined) {
      const url = urlValue === '' ? null : urlValue;
      updateData.url = url;
    }
    const currentUserId = currentUser.id.toString();
    updateData.status = canManageShops ? 'approved' : 'pending';
    updateData.reviewedBy = canManageShops ? currentUserId : null;
    updateData.reviewedAt = canManageShops ? new Date() : null;
    const [affectedRows, [updatedShop]] = await Shop.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
    if (affectedRows === 0) throw badRequest('Дані цього магазину не оновлено');
    return {
      id: updatedShop.id,
      title: updatedShop.title,
      description: updatedShop.description || '',
      url: updatedShop.url || '',
      status: updatedShop.status,
      reviewedBy: updatedShop.reviewedBy || '',
      reviewedAt: updatedShop.reviewedAt
        ? formatDate(updatedShop.reviewedAt)
        : '',
      createdBy: updatedShop.createdBy || '',
    };
  }

  async updateShopLogo(id, filename, currentUser, transaction) {
    if (!filename) throw badRequest('Файл не завантажено');
    const foundShop = await Shop.findByPk(id);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const isShopOwner = currentUser.id.toString() === foundShop.createdBy;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isShopOwner && !canManageShops) {
      throw forbidden(
        'Ви не маєте дозволу на оновлення логотипу цього магазину'
      );
    }
    const updateData = { logo: filename };
    const currentUserId = currentUser.id.toString();
    updateData.status = canManageShops ? 'approved' : 'pending';
    updateData.reviewedBy = canManageShops ? currentUserId : null;
    updateData.reviewedAt = canManageShops ? new Date() : null;
    const [affectedRows, [updatedShopLogo]] = await Shop.update(updateData, {
      where: { id },
      returning: true,
      raw: true,
      fields: ['logo', 'status', 'reviewedBy', 'reviewedAt'],
      transaction,
    });
    if (affectedRows === 0) throw badRequest('Логотип магазину не оновлено');
    return {
      id: updatedShopLogo.id,
      logo: updatedShopLogo.logo || '',
      status: updatedShopLogo.status,
      reviewedBy: updatedShopLogo.reviewedBy || '',
      reviewedAt: updatedShopLogo.reviewedAt
        ? formatDate(updatedShopLogo.reviewedAt)
        : '',
      createdBy: updatedShopLogo.createdBy || '',
    };
  }

  async removeShopLogo(id, currentUser, transaction) {
    const foundShop = await Shop.findByPk(id);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const isShopOwner = currentUser.id.toString() === foundShop.createdBy;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isShopOwner && !canManageShops) {
      throw forbidden(
        'Ви не маєте дозволу на видалення логотипу цього магазину'
      );
    }
    const updateData = { logo: null };
    const currentUserId = currentUser.id.toString();
    updateData.status = canManageShops ? 'approved' : 'pending';
    updateData.reviewedBy = canManageShops ? currentUserId : null;
    updateData.reviewedAt = canManageShops ? new Date() : null;
    const [affectedRows, [removedShopLogo]] = await Shop.update(updateData, {
      where: { id },
      returning: true,
      raw: true,
      fields: ['logo', 'status', 'reviewedBy', 'reviewedAt'],
      transaction,
    });
    if (affectedRows === 0) throw badRequest('Логотип магазину не видалено');
    return {
      id: removedShopLogo.id,
      logo: removedShopLogo.logo || '',
      status: removedShopLogo.status,
      reviewedBy: removedShopLogo.reviewedBy || '',
      reviewedAt: removedShopLogo.reviewedAt
        ? formatDate(removedShopLogo.reviewedAt)
        : '',
      createdBy: removedShopLogo.createdBy || '',
    };
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
