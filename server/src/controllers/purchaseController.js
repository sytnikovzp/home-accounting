const { sequelize } = require('../db/dbPostgres/models');
const { getCurrentUser } = require('../services/userService');
const {
  getAllPurchases,
  getPurchaseByUuid,
  createPurchase,
  updatePurchase,
  deletePurchase,
} = require('../services/purchaseService');

class PurchaseController {
  async getAllPurchases(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { sort = 'uuid', order = 'asc' } = req.query;
      const { allPurchases, total } = await getAllPurchases(
        limit,
        offset,
        sort,
        order
      );
      if (allPurchases.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allPurchases);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get all purchases error:', error.message);
      next(error);
    }
  }

  async getPurchaseByUuid(req, res, next) {
    try {
      const { purchaseUuid } = req.params;
      const purchase = await getPurchaseByUuid(purchaseUuid);
      if (purchase) {
        res.status(200).json(purchase);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get purchase by uuid error:', error.message);
      next(error);
    }
  }

  async createPurchase(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { product, amount, price, shop, measure, currency, date } =
        req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const newPurchase = await createPurchase(
        product,
        amount,
        price,
        shop,
        measure,
        currency,
        date,
        currentUser,
        transaction
      );
      if (newPurchase) {
        await transaction.commit();
        res.status(201).json(newPurchase);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Create purchase error:', error.message);
      next(error);
    }
  }

  async updatePurchase(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { purchaseUuid } = req.params;
      const { product, amount, price, shop, measure, currency, date } =
        req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedPurchase = await updatePurchase(
        purchaseUuid,
        product,
        amount,
        price,
        shop,
        measure,
        currency,
        date,
        currentUser,
        transaction
      );
      if (updatedPurchase) {
        await transaction.commit();
        res.status(200).json(updatedPurchase);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Update purchase error:', error.message);
      next(error);
    }
  }

  async deletePurchase(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { purchaseUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.email);
      const deletedPurchase = await deletePurchase(
        purchaseUuid,
        currentUser,
        transaction
      );
      if (deletedPurchase) {
        await transaction.commit();
        res.sendStatus(res.statusCode);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Delete purchase error:', error.message);
      next(error);
    }
  }
}

module.exports = new PurchaseController();
