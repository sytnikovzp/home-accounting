const { Router } = require('express');
// =====================================
const {
  getMoneyByShop,
  getMoneyByCategory,
} = require('../controllers/statisticController');

const statisticRouter = new Router();

statisticRouter
  .route('/get-money-by-shop/:shopId')
  .get(getMoneyByShop);

statisticRouter
  .route('/get-money-by-category/:categoryId')
  .get(getMoneyByCategory);

module.exports = statisticRouter;
