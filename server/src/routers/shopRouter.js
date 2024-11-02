const { Router } = require('express');
// ==============================================================
const {
  getAllShops,
  createShop,
  updateShop,
  getShopById,
  deleteShop,
  changeImage,
} = require('../controllers/shopController');
const {
  validation: { validateNewShop, validateUpdShop },
  pagination: { paginateElements },
  upload: { uploadShopImages },
} = require('../middlewares');

const shopRouter = new Router();

shopRouter
  .route('/')
  .get(paginateElements, getAllShops)
  .post(validateNewShop, createShop);

shopRouter
  .route('/:shopId')
  .get(getShopById)
  .patch(validateUpdShop, updateShop)
  .delete(deleteShop);

shopRouter
  .route('/:shopId/image')
  .patch(uploadShopImages.single('shopImage'), changeImage);

module.exports = shopRouter;
