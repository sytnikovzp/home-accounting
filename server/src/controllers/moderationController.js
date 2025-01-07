const { sequelize } = require('../db/dbPostgres/models');

const {
  getPendingItemsFromAllEntities,
  updateCategoryStatus,
  updateProductStatus,
  updateEstablishmentStatus,
} = require('../services/moderationService');
const { getCurrentUser } = require('../services/userService');

class ModerationController {
  async getAllPendingItems(req, res, next) {
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
      console.error('Get all pending items error: ', error.message);
      next(error);
    }
  }

  async moderationCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { categoryUuid } = req.params;
      const { status } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
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
      console.error('Moderation category error: ', error.message);
      next(error);
    }
  }

  async moderationProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { productUuid } = req.params;
      const { status } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
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
      console.error('Moderation product error: ', error.message);
      next(error);
    }
  }

  async moderationEstablishment(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { establishmentUuid } = req.params;
      const { status } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedEstablishment = await updateEstablishmentStatus(
        establishmentUuid,
        status,
        currentUser,
        transaction
      );
      if (updatedEstablishment) {
        await transaction.commit();
        res.status(200).json(updatedEstablishment);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Moderation establishment error: ', error.message);
      next(error);
    }
  }
}

module.exports = new ModerationController();
