const { Router } = require('express');
// ==============================================================
const {
  getCostByCategoryPerPeriod,
  getCostByShopPerPeriod,
  getCostByCategories,
  getCostByShops,
} = require('../controllers/statisticController');
const {
  auth: { authHandler },
} = require('../middlewares');

const statisticRouter = new Router();

statisticRouter
  .route('/category-per-period')
  .get(authHandler, getCostByCategoryPerPeriod);

statisticRouter
  .route('/shop-per-period')
  .get(authHandler, getCostByShopPerPeriod);

statisticRouter
  .route('/categories')
  .get(authHandler, getCostByCategories);

statisticRouter
  .route('/shops')
  .get(authHandler, getCostByShops);

module.exports = statisticRouter;
