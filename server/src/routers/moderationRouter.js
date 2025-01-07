const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateModeration },
  pagination: { paginateElements },
} = require('../middlewares');

const {
  getAllPendingItems,
  moderationCategory,
  moderationProduct,
  moderationEstablishment,
} = require('../controllers/moderationController');

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
  .route('/establishments/:establishmentUuid')
  .patch(authHandler, validateModeration, moderationEstablishment);

module.exports = moderationRouter;
