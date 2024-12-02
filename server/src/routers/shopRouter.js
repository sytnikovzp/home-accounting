const { Router } = require('express');
// ==============================================================
const {
  getAllShops,
  getShopById,
  reviewShop,
  createShop,
  updateShop,
  updateShopLogo,
  removeShopLogo,
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
  .route('/logo/:shopId')
  .patch(authHandler, uploadShopLogos.single('shopLogo'), updateShopLogo);

shopRouter
  .route('/delete-logo/:shopId')
  .patch(authHandler, removeShopLogo);

shopRouter
  .route('/moderate/:shopId')
  .patch(authHandler, validateModeration, reviewShop);

shopRouter
  .route('/:shopId')
  .get(authHandler, getShopById)
  .patch(authHandler, validateShop, updateShop)
  .delete(authHandler, deleteShop);

module.exports = shopRouter;
