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

moderationsRouter.use(authHandler);

moderationsRouter.route('/').get(paginateElements, getAllPendingItems);

moderationsRouter
  .route('/categories/:categoryUuid')
  .patch(validateModeration, moderationCategory);

moderationsRouter
  .route('/products/:productUuid')
  .patch(validateModeration, moderationProduct);

moderationsRouter
  .route('/establishments/:establishmentUuid')
  .patch(validateModeration, moderationEstablishment);

module.exports = moderationsRouter;
