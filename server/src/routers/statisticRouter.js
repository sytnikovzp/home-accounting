const { Router } = require('express');
// ==============================================================
const {
  getCostByCategoryPerPeriod,
  getCostByShopPerPeriod,
  getCostByCategories,
  getCostByShops,
} = require('../controllers/statisticController');

const statisticRouter = new Router();

statisticRouter
  .route('/category-per-period')
  .get(getCostByCategoryPerPeriod);

statisticRouter
  .route('/shop-per-period')
  .get(getCostByShopPerPeriod);

statisticRouter
  .route('/categories')
  .get(getCostByCategories);

statisticRouter
  .route('/shops')
  .get(getCostByShops);

module.exports = statisticRouter;
