const { Router } = require('express');
// =====================================
const shopController = require('../controllers/shopController');
const {
  validate: { validateShop },
} = require('../middlewares');

const shopRouter = new Router();

shopRouter
  .route('/')
  .get(shopController.getAllShops)
  .post(validateShop, shopController.createShop)
  .put(validateShop, shopController.updateShop);

shopRouter
  .route('/:shopId')
  .get(shopController.getShopById)
  .delete(shopController.deleteShop);

module.exports = shopRouter;
