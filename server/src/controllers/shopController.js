const { notFound, badRequest } = require('../errors/customErrors');
const { Shop, sequelize } = require('../db/dbPostgres/models');
const { formatDate } = require('../utils/sharedFunctions');

class ShopController {
  async getAllShops(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const allShops = await Shop.findAll({
        attributes: ['id', 'title', 'url', 'image'],
        raw: true,
        limit,
        offset,
      });
      const shopsCount = await Shop.count();
      if (allShops.length > 0) {
        const formattedAllShops = allShops.map((shop) => {
          return {
            id: shop.id,
            title: shop.title,
            url: shop['url'] || '',
            image: shop['image'] || '',
          };
        });
        res
          .status(200)
          .set('X-Total-Count', shopsCount)
          .json(formattedAllShops);
      } else throw notFound('Shops not found');
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getShopById(req, res, next) {
    try {
      const { shopId } = req.params;
      const shopById = await Shop.findByPk(shopId);
      if (shopById) {
        const shopData = shopById.toJSON();
        const formattedShop = {
          ...shopData,
          description: shopData.description || '',
          url: shopData.url || '',
          image: shopData.image || '',
          createdAt: formatDate(shopData.createdAt),
          updatedAt: formatDate(shopData.updatedAt),
        };
        res.status(200).json(formattedShop);
      } else throw notFound('Shop not found');
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async createShop(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        title,
        description: descriptionValue,
        url: urlValue,
        image: imageValue,
      } = req.body;
      const description = descriptionValue === '' ? null : descriptionValue;
      const url = urlValue === '' ? null : urlValue;
      const image = imageValue === '' ? null : imageValue;
      const newBody = { title, description, url, image };
      const newShop = await Shop.create(newBody, {
        transaction,
        returning: true,
      });
      if (newShop) {
        const shopData = newShop.toJSON();
        const formattedNewShop = {
          ...shopData,
          description: shopData.description || '',
          url: shopData.url || '',
          image: shopData.image || '',
        };
        await transaction.commit();
        res.status(201).json(formattedNewShop);
      } else {
        await transaction.rollback();
        throw badRequest('Shop is not created');
      }
    } catch (error) {
      console.log(error.message);
      await transaction.rollback();
      next(error);
    }
  }

  async updateShop(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { shopId } = req.params;
      const {
        title,
        description: descriptionValue,
        url: urlValue,
        image: imageValue,
      } = req.body;
      const description = descriptionValue === '' ? null : descriptionValue;
      const url = urlValue === '' ? null : urlValue;
      const image = imageValue === '' ? null : imageValue;
      const newBody = { title, description, url, image };
      const [affectedRows, [updatedShop]] = await Shop.update(newBody, {
        where: { shopId },
        returning: true,
        transaction,
      });
      if (affectedRows > 0) {
        const shopData = updatedShop.toJSON();
        const formattedUpdShop = {
          ...shopData,
          description: shopData.description || '',
          url: shopData.url || '',
          image: shopData.image || '',
        };
        await transaction.commit();
        res.status(200).json(formattedUpdShop);
      } else {
        await transaction.rollback();
        throw badRequest('Shop is not updated');
      }
    } catch (error) {
      console.log(error.message);
      await transaction.rollback();
      next(error);
    }
  }

  async deleteShop(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { shopId } = req.params;
      const deleteShop = await Shop.destroy({
        where: {
          id: shopId,
        },
        transaction,
      });
      if (deleteShop) {
        await transaction.commit();
        res.sendStatus(res.statusCode);
      } else {
        await transaction.rollback();
        throw badRequest('Shop is not deleted');
      }
    } catch (error) {
      console.log(error.message);
      await transaction.rollback();
      next(error);
    }
  }

  async changeImage(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        file: { filename },
        params: { shopId },
      } = req;
      const [affectedRows, [updatedImageShop]] = await Shop.update(
        {
          image: filename,
        },
        {
          where: {
            id: shopId,
          },
          returning: true,
          raw: true,
          fields: ['image'],
          transaction,
        }
      );
      if (affectedRows > 0) {
        const formattedUpdImageShop = {
          ...updatedImageShop,
          description: updatedImageShop.description || '',
          url: updatedImageShop.url || '',
          image: updatedImageShop.image || '',
        };
        await transaction.commit();
        res.status(200).json(formattedUpdImageShop);
      } else {
        await transaction.rollback();
        throw badRequest('Shop image is not changed');
      }
    } catch (error) {
      console.log(error.message);
      await transaction.rollback();
      next(error);
    }
  }
}

module.exports = new ShopController();
