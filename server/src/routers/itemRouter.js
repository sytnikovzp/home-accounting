const { Router } = require('express');
// ====================================================
const {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
} = require('../controllers/itemController');
const {
  validation: { validateItem },
  pagination: { paginateElements },
} = require('../middlewares');

const itemRouter = new Router();

itemRouter
  .route('/')
  .get(paginateElements, getAllItems)
  .post(validateItem, createItem)
  .put(validateItem, updateItem);

itemRouter
  .route('/:itemId')
  .get(getItemById)
  .delete(deleteItem);

module.exports = itemRouter;
