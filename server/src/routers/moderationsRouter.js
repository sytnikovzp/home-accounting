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
} = require('../controllers/moderationsController');

const moderationsRouter = new Router();

moderationsRouter
  .route('/')
  .get(authHandler, paginateElements, getAllPendingItems);

moderationsRouter
  .route('/categories/:categoryUuid')
  .patch(authHandler, validateModeration, moderationCategory);

moderationsRouter
  .route('/products/:productUuid')
  .patch(authHandler, validateModeration, moderationProduct);

moderationsRouter
  .route('/establishments/:establishmentUuid')
  .patch(authHandler, validateModeration, moderationEstablishment);

module.exports = moderationsRouter;
