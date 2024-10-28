const { Router } = require('express');
// =====================================
const itemController = require('../controllers/itemController');

const itemRouter = new Router();

itemRouter
  .route('/')
  .get(itemController.getAllItems)
  .post(itemController.createItem)
  .put(itemController.updateItem);

itemRouter
  .route('/:itemId')
  .get(itemController.getItemById)
  .delete(itemController.deleteItem);

module.exports = itemRouter;
