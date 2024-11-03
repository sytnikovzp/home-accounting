const { Shop, sequelize } = require('../db/dbPostgres/models');
const {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  updateShopLogo,
  removeShopLogo,
} = require('../services/shopService');

class ShopController {
  async getAllShops(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const allShops = await getAllShops(limit, offset);
      const shopsCount = await Shop.count();
      res.status(200).set('X-Total-Count', shopsCount).json(allShops);
    } catch (error) {
      console.error('Get all shops error: ', error.message);
      next(error);
    }
  }

  async getShopById(req, res, next) {
    try {
      const { shopId } = req.params;
      const shop = await getShopById(shopId);
      res.status(200).json(shop);
    } catch (error) {
      console.error('Get shop by id error: ', error.message);
      next(error);
    }
  }

  async createShop(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, description, url, logo } = req.body;
      const newShop = await createShop(
        title,
        description,
        url,
        logo,
        transaction
      );
      await transaction.commit();
      res.status(201).json(newShop);
    } catch (error) {
      await transaction.rollback();
      console.error('Create shop error: ', error.message);
      next(error);
    }
  }

  async updateShop(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { shopId } = req.params;
      const { title, description, url } = req.body;
      const updatedShop = await updateShop(
        shopId,
        title,
        description,
        url,
        transaction
      );
      await transaction.commit();
      res.status(200).json(updatedShop);
    } catch (error) {
      await transaction.rollback();
      console.error('Update shop error: ', error.message);
      next(error);
    }
  }

  async deleteShop(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { shopId } = req.params;
      await deleteShop(shopId, transaction);
      await transaction.commit();
      res.sendStatus(res.statusCode);
    } catch (error) {
      await transaction.rollback();
      console.error('Delete shop error: ', error.message);
      next(error);
    }
  }

  async updateShopLogo(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { shopId },
        file: { filename },
      } = req;
      const updatedLogoShop = await updateShopLogo(
        shopId,
        filename,
        transaction
      );
      await transaction.commit();
      res.status(200).json(updatedLogoShop);
    } catch (error) {
      await transaction.rollback();
      console.error('Update shop logo error: ', error.message);
      next(error);
    }
  }

  async removeShopLogo(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { shopId } = req.params;
      const updatedShop = await removeShopLogo(shopId, transaction);
      await transaction.commit();
      res.status(200).json(updatedShop);
    } catch (error) {
      await transaction.rollback();
      console.error('Remove shop logo error: ', error.message);
      next(error);
    }
  }
}

module.exports = new ShopController();
