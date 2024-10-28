const { Router } = require('express');
// =====================================
const shopController = require('../controllers/shopController');
const {
  validation: { validateShop },
  pagination: { paginateElements },
  upload: { uploadImages },
} = require('../middlewares');

const shopRouter = new Router();

shopRouter
  .route('/')
  .get(paginateElements, shopController.getAllShops)
  .post(validateShop, shopController.createShop)
  .put(validateShop, shopController.updateShop);

shopRouter
  .route('/:shopId')
  .get(shopController.getShopById)
  .delete(shopController.deleteShop);

shopRouter
  .route('/:shopId/image')
  .patch(uploadImages.single('shopImage'), shopController.changeImage);

module.exports = shopRouter;
