const { Router } = require('express');
// =====================================
const itemController = require('../controllers/itemController');
const {
  validate: { validateItem },
} = require('../middlewares');
const {
  pagination: { paginateElements },
} = require('../middlewares');

const itemRouter = new Router();

itemRouter
  .route('/')
  .get(paginateElements, itemController.getAllItems)
  .post(validateItem, itemController.createItem)
  .put(validateItem, itemController.updateItem);

itemRouter
  .route('/:itemId')
  .get(itemController.getItemById)
  .delete(itemController.deleteItem);

module.exports = itemRouter;
