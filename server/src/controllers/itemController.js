const { Item, sequelize } = require('../db/dbPostgres/models');
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../services/itemService');

class ItemController {
  async getAllItems(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const allItems = await getAllItems(limit, offset);
      const itemCount = await Item.count();
      res.status(200).set('X-Total-Count', itemCount).json(allItems);
    } catch (error) {
      console.error('Get all items error:', error.message);
      next(error);
    }
  }

  async getItemById(req, res, next) {
    try {
      const { itemId } = req.params;
      const item = await getItemById(itemId);
      res.status(200).json(item);
    } catch (error) {
      console.error('Get item by id error:', error.message);
      next(error);
    }
  }

  async createItem(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { product, amount, price, shop, measure, currency } = req.body;
      const newItem = await createItem(
        product,
        amount,
        price,
        shop,
        measure,
        currency,
        transaction
      );
      await transaction.commit();
      res.status(201).json(newItem);
    } catch (error) {
      await transaction.rollback();
      console.error('Create item error:', error.message);
      next(error);
    }
  }

  async updateItem(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { itemId } = req.params;
      const { product, amount, price, shop, measure, currency } = req.body;
      const updatedItem = await updateItem(
        itemId,
        product,
        amount,
        price,
        shop,
        measure,
        currency,
        transaction
      );
      await transaction.commit();
      res.status(200).json(updatedItem);
    } catch (error) {
      await transaction.rollback();
      console.error('Update item error:', error.message);
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { itemId } = req.params;
      await deleteItem(itemId, transaction);
      await transaction.commit();
      res.sendStatus(res.statusCode);
    } catch (error) {
      await transaction.rollback();
      console.error('Delete item error:', error.message);
      next(error);
    }
  }
}

module.exports = new ItemController();
