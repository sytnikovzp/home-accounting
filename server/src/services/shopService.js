const { Shop } = require('../db/dbPostgres/models');
const { formatDate, checkPermission } = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

class ShopService {
  async getAllShops(limit, offset, status) {
    const foundShops = await Shop.findAll({
      attributes: ['id', 'title', 'url', 'logo'],
      where: { status },
      raw: true,
      limit,
      offset,
    });
    if (foundShops.length === 0) throw notFound('Shops not found');
    const allShops = foundShops.map((shop) => ({
      id: shop.id,
      title: shop.title,
      url: shop.url || '',
      logo: shop.logo || '',
    }));
    const total = await Shop.count();
    return {
      allShops,
      total,
    };
  }

  async getShopById(shopId) {
    const foundShop = await Shop.findByPk(shopId);
    if (!foundShop) throw notFound('Shop not found');
    const shopData = foundShop.toJSON();
    return {
      id: shopData.id,
      title: shopData.title,
      description: shopData.description || '',
      url: shopData.url || '',
      logo: shopData.logo || '',
      status: shopData.status,
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
      throw forbidden('You don`t have permission to moderate shops');
    }
    const foundShop = await Shop.findByPk(id);
    if (!foundShop) throw notFound('Shop not found');
    if (!['approved', 'rejected'].includes(status)) {
      throw notFound('Status not found');
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
    if (affectedRows === 0) throw badRequest('Shop is not moderated');
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
      throw forbidden('You don`t have permission to create shops');
    }
    const duplicateShop = await Shop.findOne({ where: { title } });
    if (duplicateShop) throw badRequest('This shop already exists');
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
    if (!newShop) throw badRequest('Shop is not created');
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
    if (!foundShop) throw notFound('Shop not found');
    const isShopOwner = currentUser.id.toString() === foundShop.createdBy;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isShopOwner && !canManageShops) {
      throw forbidden('You don`t have permission to edit this shop');
    }
    const currentTitle = foundShop.title;
    if (title !== currentTitle) {
      const duplicateShop = await Shop.findOne({ where: { title } });
      if (duplicateShop) throw badRequest('This shop already exists');
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
    if (affectedRows === 0) throw badRequest('Shop is not updated');
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
    if (!filename) throw badRequest('No file uploaded');
    const foundShop = await Shop.findByPk(id);
    if (!foundShop) throw notFound('Shop not found');
    const isShopOwner = currentUser.id.toString() === foundShop.createdBy;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isShopOwner && !canManageShops) {
      throw forbidden('You don`t have permission to edit this shop');
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
    if (affectedRows === 0) throw badRequest('Shop logo is not updated');
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
    if (!foundShop) throw notFound('Shop not found');
    const isShopOwner = currentUser.id.toString() === foundShop.createdBy;
    const canManageShops = await checkPermission(currentUser, 'MANAGE_SHOPS');
    if (!isShopOwner && !canManageShops) {
      throw forbidden('You don`t have permission to edit this shop');
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
    if (affectedRows === 0) throw badRequest('Shop logo is not removed');
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
      throw forbidden('You don`t have permission to delete this shop');
    const foundShop = await Shop.findByPk(shopId);
    if (!foundShop) throw notFound('Shop not found');
    const deletedShop = await Shop.destroy({
      where: { id: shopId },
      transaction,
    });
    if (!deletedShop) throw badRequest('Shop is not deleted');
    return deletedShop;
  }
}

module.exports = new ShopService();
