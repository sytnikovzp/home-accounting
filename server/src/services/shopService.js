const { Shop } = require('../db/dbPostgres/models');
const { notFound, badRequest } = require('../errors/customErrors');
const { formatDate } = require('../utils/sharedFunctions');

class ShopService {
  async getAllShops(limit, offset) {
    const allShops = await Shop.findAll({
      attributes: ['id', 'title', 'url', 'logo'],
      raw: true,
      limit,
      offset,
    });
    if (allShops.length === 0) throw notFound('Shops not found');
    const formattedShops = allShops.map((shop) => ({
      id: shop.id,
      title: shop.title,
      url: shop.url || '',
      logo: shop.logo || '',
    }));
    return formattedShops;
  }

  async getShopById(shopId) {
    const shopById = await Shop.findByPk(shopId);
    if (!shopById) throw notFound('Shop not found');
    const shopData = shopById.toJSON();
    return {
      id: shopData.id,
      title: shopData.title,
      description: shopData.description || '',
      url: shopData.url || '',
      logo: shopData.logo || '',
      createdAt: formatDate(shopData.createdAt),
      updatedAt: formatDate(shopData.updatedAt),
    };
  }

  async createShop(title, descriptionValue, urlValue, transaction) {
    const existingShop = await Shop.findOne({ where: { title } });
    if (existingShop) throw badRequest('This shop already exists');
    const description = descriptionValue === '' ? null : descriptionValue;
    const url = urlValue === '' ? null : urlValue;
    const newProductData = {
      title,
      description,
      url,
    };
    const newShop = await Shop.create(newProductData, {
      transaction,
      returning: true,
    });
    if (!newShop) throw badRequest('Shop is not created');
    return {
      id: newShop.id,
      title: newShop.title,
      description: newShop.description || '',
      url: newShop.url || '',
    };
  }

  async updateShop(id, title, descriptionValue, urlValue, transaction) {
    const shopById = await Shop.findByPk(id);
    if (!shopById) throw notFound('Shop not found');
    const currentTitle = shopById.title;
    if (title !== currentTitle) {
      const existingShop = await Shop.findOne({ where: { title } });
      if (existingShop) throw badRequest('This shop already exists');
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
    };
  }

  async updateShopLogo(id, filename, transaction) {
    const shopById = await Shop.findByPk(id);
    if (!shopById) throw notFound('Shop not found');
    if (!filename) throw badRequest('No file uploaded');
    const [affectedRows, [updatedShopLogo]] = await Shop.update(
      { logo: filename },
      {
        where: { id },
        returning: true,
        raw: true,
        fields: ['logo'],
        transaction,
      }
    );
    if (affectedRows === 0) throw badRequest('Shop logo is not updated');
    return {
      id: updatedShopLogo.id,
      logo: updatedShopLogo.logo || '',
    };
  }

  async removeShopLogo(id, transaction) {
    const shopById = await Shop.findByPk(id);
    if (!shopById) throw notFound('Shop not found');
    const [affectedRows, [removedShopLogo]] = await Shop.update(
      { logo: null },
      {
        where: { id },
        returning: true,
        raw: true,
        fields: ['logo'],
        transaction,
      }
    );
    if (affectedRows === 0) throw badRequest('Shop logo is not removed');
    return {
      id: removedShopLogo.id,
      logo: removedShopLogo.logo || '',
    };
  }

  async deleteShop(shopId, transaction) {
    const shopById = await Shop.findByPk(shopId);
    if (!shopById) throw notFound('Shop not found');
    const deleteShop = await Shop.destroy({
      where: { id: shopId },
      transaction,
    });
    if (!deleteShop) throw badRequest('Shop is not deleted');
    return deleteShop;
  }
}

module.exports = new ShopService();
