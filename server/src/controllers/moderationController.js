const { sequelize } = require('../db/dbPostgres/models');

const {
  getPendingItemsFromAllEntities,
  updateCategoryStatus,
  updateProductStatus,
  updateEstablishmentStatus,
} = require('../services/moderationService');
const { getCurrentUser } = require('../services/usersService');

class ModerationController {
  static async getAllPendingItems(req, res, next) {
    try {
      const {
        pagination: { limit, offset },
        query: { sort = 'uuid', order = 'asc' },
      } = req;
      const { allItems, totalCount } = await getPendingItemsFromAllEntities(
        limit,
        offset,
        sort,
        order
      );
      if (allItems.length > 0) {
        res.status(200).set('X-Total-Count', totalCount).json(allItems);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get all pending items error: ', error.message);
      next(error);
    }
  }

  static async moderationCategory(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { categoryUuid },
        body: { status },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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

  static async moderationProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { productUuid },
        body: { status },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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

  static async moderationEstablishment(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { establishmentUuid },
        body: { status },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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

module.exports = ModerationController;
