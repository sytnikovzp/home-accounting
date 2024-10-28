const createError = require('http-errors');
const { format } = require('date-fns');
// =====================================
const { Shop, sequelize } = require('../db/dbPostgres/models');

class shopController {
  async getAllShops(req, res, next) {
    try {
      const allShops = await Shop.findAll({
        attributes: ['id', 'title', 'url'],
        raw: true,
      });

      if (allShops.length > 0) {
        res.status(200).json(allShops);
      } else {
        next(createError(404, 'Shops not found'));
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getShopById(req, res, next) {
    const { shopId } = req.params;

    try {
      const shopById = await Shop.findByPk(shopId);

      if (shopById) {
        const shopData = shopById.toJSON();

        const formattedShop = {
          ...shopData,
          description: shopData.description || '',
          url: shopData.url || '',
          image: shopData.image || '',
          createdAt: format(
            new Date(shopData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(shopData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        res.status(200).json(formattedShop);
      } else {
        next(createError(404, 'Shop not found'));
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async createShop(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const body = req.body;

      const newShop = await Shop.create(body, {
        transaction: t,
        returning: true,
      });

      if (newShop) {
        const shopData = newShop.toJSON();

        const formattedNewShop = {
          ...shopData,
          description: shopData.description || '',
          url: shopData.url || '',
          image: shopData.image || '',
          createdAt: format(
            new Date(shopData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(shopData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        await t.commit();
        res.status(201).json(formattedNewShop);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }

  async updateShop(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id, title, description: descriptionValue } = req.body;

      const description = descriptionValue === '' ? null : descriptionValue;

      const newBody = { title, description };

      const [affectedRows, [updatedShop]] = await Shop.update(newBody, {
        where: { id },
        returning: true,
        transaction: t,
      });

      if (affectedRows > 0) {
        const shopData = updatedShop.toJSON();

        const formattedUpdShop = {
          ...shopData,
          description: shopData.description || '',
          url: shopData.url || '',
          image: shopData.image || '',
          createdAt: format(
            new Date(shopData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(shopData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        await t.commit();
        res.status(201).json(formattedUpdShop);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }

  async deleteShop(req, res, next) {
    const t = await sequelize.transaction();

    const { shopId } = req.params;

    try {
      const deleteShop = await Shop.destroy({
        where: {
          id: shopId,
        },
        transaction: t,
      });

      if (deleteShop) {
        await t.commit();
        res.sendStatus(res.statusCode);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }
}

module.exports = new shopController();
