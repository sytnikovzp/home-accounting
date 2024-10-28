const { Router } = require('express');
// ====================================================
const {
  getAllShops,
  createShop,
  updateShop,
  getShopById,
  deleteShop,
  changeImage,
} = require('../controllers/shopController');
const {
  validation: { validateShop },
  pagination: { paginateElements },
  upload: { uploadImages },
} = require('../middlewares');

const shopRouter = new Router();

shopRouter
  .route('/')
  .get(paginateElements, getAllShops)
  .post(validateShop, createShop)
  .put(validateShop, updateShop);

shopRouter
  .route('/:shopId')
  .get(getShopById)
  .delete(deleteShop);

shopRouter
  .route('/:shopId/image')
  .patch(uploadImages.single('shopImage'), changeImage);

module.exports = shopRouter;
