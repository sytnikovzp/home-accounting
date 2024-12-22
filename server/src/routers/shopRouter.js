const { Router } = require('express');
// ==============================================================
const {
  getAllShops,
  getShopByUuid,
  createShop,
  updateShop,
  updateShopLogo,
  removeShopLogo,
  deleteShop,
} = require('../controllers/shopController');
const {
  auth: { authHandler },
  validation: { validateShop },
  pagination: { paginateElements },
  upload: { uploadShopLogos },
} = require('../middlewares');

const shopRouter = new Router();

shopRouter
  .route('/')
  .get(authHandler, paginateElements, getAllShops)
  .post(authHandler, validateShop, createShop);

shopRouter
  .route('/update-logo/:shopUuid')
  .patch(authHandler, uploadShopLogos.single('shopLogo'), updateShopLogo);

shopRouter
  .route('/delete-logo/:shopUuid')
  .patch(authHandler, removeShopLogo);

shopRouter
  .route('/:shopUuid')
  .get(authHandler, getShopByUuid)
  .patch(authHandler, validateShop, updateShop)
  .delete(authHandler, deleteShop);

module.exports = shopRouter;
