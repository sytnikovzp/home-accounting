const { sequelize } = require('../db/dbPostgres/models');
const { getCurrentUser } = require('../services/userService');
const {
  getAllShops,
  getShopByUuid,
  updateShopStatus,
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
      const { status = 'approved', sort = 'uuid', order = 'asc' } = req.query;
      const { allShops, total } = await getAllShops(
        status,
        limit,
        offset,
        sort,
        order
      );
      if (allShops.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allShops);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get all shops error: ', error.message);
      next(error);
    }
  }

  async getShopByUuid(req, res, next) {
    try {
      const { shopUuid } = req.params;
      const shop = await getShopByUuid(shopUuid);
      if (shop) {
        res.status(200).json(shop);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get shop by uuid error: ', error.message);
      next(error);
    }
  }

  async createShop(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, description, url } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const newShop = await createShop(
        title,
        description,
        url,
        currentUser,
        transaction
      );
      if (newShop) {
        await transaction.commit();
        res.status(201).json(newShop);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Create shop error: ', error.message);
      next(error);
    }
  }

  async updateShop(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { shopUuid } = req.params;
      const { title, description, url } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedShop = await updateShop(
        shopUuid,
        title,
        description,
        url,
        currentUser,
        transaction
      );
      if (updatedShop) {
        await transaction.commit();
        res.status(200).json(updatedShop);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Update shop error: ', error.message);
      next(error);
    }
  }

  async updateShopLogo(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { shopUuid },
        file: { filename },
      } = req;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedLogoShop = await updateShopLogo(
        shopUuid,
        filename,
        currentUser,
        transaction
      );
      if (updatedLogoShop) {
        await transaction.commit();
        res.status(200).json(updatedLogoShop);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Update logo shop error: ', error.message);
      next(error);
    }
  }

  async removeShopLogo(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { shopUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedShop = await removeShopLogo(
        shopUuid,
        currentUser,
        transaction
      );
      if (updatedShop) {
        await transaction.commit();
        res.status(200).json(updatedShop);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Remove logo shop error: ', error.message);
      next(error);
    }
  }

  async moderateShop(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { shopUuid } = req.params;
      const { status } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedShop = await updateShopStatus(
        shopUuid,
        status,
        currentUser,
        transaction
      );
      if (updatedShop) {
        await transaction.commit();
        res.status(200).json(updatedShop);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.log('Moderate shop error: ', error.message);
      next(error);
    }
  }

  async deleteShop(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { shopUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.email);
      const deletedShop = await deleteShop(shopUuid, currentUser, transaction);
      if (deletedShop) {
        await transaction.commit();
        res.sendStatus(res.statusCode);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Delete shop error: ', error.message);
      next(error);
    }
  }
}

module.exports = new ShopController();
