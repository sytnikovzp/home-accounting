const { sequelize } = require('../db/dbPostgres/models');
const { getCurrentUser } = require('../services/userService');
const {
  getPendingItemsFromAllEntities,
  updateCategoryStatus,
  updateProductStatus,
  updateShopStatus,
} = require('../services/moderationService');

class ModerationController {
  async getPendingItems(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { sort = 'uuid', order = 'asc' } = req.query;
      const { allItems, total } = await getPendingItemsFromAllEntities(
        limit,
        offset,
        sort,
        order
      );
      if (allItems.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allItems);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get all pending items error: ', error.message);
      next(error);
    }
  }

  async moderationCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { categoryUuid } = req.params;
      const { status } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedCategory = await updateCategoryStatus(
        categoryUuid,
        status,
        currentUser,
        transaction
      );
      if (updatedCategory) {
        await transaction.commit();
        res.status(200).json(updatedCategory);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.log('Moderation category error: ', error.message);
      next(error);
    }
  }

  async moderationProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { productUuid } = req.params;
      const { status } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedProduct = await updateProductStatus(
        productUuid,
        status,
        currentUser,
        transaction
      );
      if (updatedProduct) {
        await transaction.commit();
        res.status(200).json(updatedProduct);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.log('Moderation product error: ', error.message);
      next(error);
    }
  }

  async moderationShop(req, res, next) {
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
      console.log('Moderation shop error: ', error.message);
      next(error);
    }
  }
}

module.exports = new ModerationController();
