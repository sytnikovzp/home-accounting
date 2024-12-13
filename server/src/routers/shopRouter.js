const { Router } = require('express');
// ==============================================================
const {
  getAllShops,
  getShopByUuid,
  createShop,
  updateShop,
  updateShopLogo,
  removeShopLogo,
  moderateShop,
  deleteShop,
} = require('../controllers/shopController');
const {
  auth: { authHandler },
  validation: { validateShop, validateModeration },
  pagination: { paginateElements },
  upload: { uploadShopLogos },
} = require('../middlewares');

const shopRouter = new Router();

shopRouter
  .route('/')
  .get(authHandler, paginateElements, getAllShops)
  .post(authHandler, validateShop, createShop);

shopRouter
  .route('/logo/:shopUuid')
  .patch(authHandler, uploadShopLogos.single('shopLogo'), updateShopLogo);

shopRouter
  .route('/delete-logo/:shopUuid')
  .patch(authHandler, removeShopLogo);

shopRouter
  .route('/moderate/:shopUuid')
  .patch(authHandler, validateModeration, moderateShop);

shopRouter
  .route('/:shopUuid')
  .get(authHandler, getShopByUuid)
  .patch(authHandler, validateShop, updateShop)
  .delete(authHandler, deleteShop);

module.exports = shopRouter;
