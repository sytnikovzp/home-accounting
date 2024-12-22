const { Router } = require('express');
// ==============================================================
const {
  getAllPendingItems,
  moderationCategory,
  moderationProduct,
  moderationShop,
} = require('../controllers/moderationController');
const {
  auth: { authHandler },
  validation: { validateModeration },
  pagination: { paginateElements },
} = require('../middlewares');

const moderationRouter = new Router();

moderationRouter
  .route('/')
  .get(authHandler, paginateElements, getAllPendingItems);

moderationRouter
  .route('/categories/:categoryUuid')
  .patch(authHandler, validateModeration, moderationCategory);

moderationRouter
  .route('/products/:productUuid')
  .patch(authHandler, validateModeration, moderationProduct);

moderationRouter
  .route('/shops/:shopUuid')
  .patch(authHandler, validateModeration, moderationShop);

module.exports = moderationRouter;
