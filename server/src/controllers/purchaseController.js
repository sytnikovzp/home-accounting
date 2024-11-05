const { sequelize } = require('../db/dbPostgres/models');
const {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
} = require('../services/purchaseService');

class PurchaseController {
  async getAllPurchases(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { allPurchases, total } = await getAllPurchases(limit, offset);
      res.status(200).set('X-Total-Count', total).json(allPurchases);
    } catch (error) {
      console.error('Get all purchases error:', error.message);
      next(error);
    }
  }

  async getPurchaseById(req, res, next) {
    try {
      const { purchaseId } = req.params;
      const purchase = await getPurchaseById(purchaseId);
      res.status(200).json(purchase);
    } catch (error) {
      console.error('Get purchase by id error:', error.message);
      next(error);
    }
  }

  async createPurchase(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { product, amount, price, shop, measure, currency } = req.body;
      const newPurchase = await createPurchase(
        product,
        amount,
        price,
        shop,
        measure,
        currency,
        transaction
      );
      await transaction.commit();
      res.status(201).json(newPurchase);
    } catch (error) {
      await transaction.rollback();
      console.error('Create purchase error:', error.message);
      next(error);
    }
  }

  async updatePurchase(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { purchaseId } = req.params;
      const { product, amount, price, shop, measure, currency } = req.body;
      const updatedPurchase = await updatePurchase(
        purchaseId,
        product,
        amount,
        price,
        shop,
        measure,
        currency,
        transaction
      );
      await transaction.commit();
      res.status(200).json(updatedPurchase);
    } catch (error) {
      await transaction.rollback();
      console.error('Update purchase error:', error.message);
      next(error);
    }
  }

  async deletePurchase(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { purchaseId } = req.params;
      await deletePurchase(purchaseId, transaction);
      await transaction.commit();
      res.sendStatus(res.statusCode);
    } catch (error) {
      await transaction.rollback();
      console.error('Delete purchase error:', error.message);
      next(error);
    }
  }
}

module.exports = new PurchaseController();
