const { Router } = require('express');
// ==============================================================
const {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  updateShopLogo,
  removeShopLogo,
  deleteShop,
} = require('../controllers/shopController');
const {
  validation: { validateShop },
  pagination: { paginateElements },
  upload: { uploadShopLogos },
} = require('../middlewares');

const shopRouter = new Router();

shopRouter
  .route('/')
  .get(paginateElements, getAllShops)
  .post(validateShop, createShop);

shopRouter
  .route('/:shopId')
  .get(getShopById)
  .patch(validateShop, updateShop)
  .delete(deleteShop);

shopRouter
  .route('/:shopId/logo')
  .patch(uploadShopLogos.single('shopLogo'), updateShopLogo);

shopRouter.route('/:shopId/remlogo').patch(removeShopLogo);

module.exports = shopRouter;
