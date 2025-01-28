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

moderationRouter.use(authHandler);

moderationRouter.route('/').get(paginateElements, getAllPendingItems);

moderationRouter
  .route('/categories/:categoryUuid')
  .patch(validateModeration, moderationCategory);

moderationRouter
  .route('/products/:productUuid')
  .patch(validateModeration, moderationProduct);

moderationRouter
  .route('/establishments/:establishmentUuid')
  .patch(validateModeration, moderationEstablishment);

module.exports = moderationRouter;
