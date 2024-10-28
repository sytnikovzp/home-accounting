const { Router } = require('express');
// =====================================
const shopController = require('../controllers/shopController');

const shopRouter = new Router();

shopRouter
  .route('/')
  .get(shopController.getAllShops)
  .post(shopController.createShop)
  .put(shopController.updateShop);

shopRouter
  .route('/:shopId')
  .get(shopController.getShopById)
  .delete(shopController.deleteShop);

module.exports = shopRouter;
