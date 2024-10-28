const { Router } = require('express');
// ====================================================
const {
  getCostByCategoryPerPeriod,
  getCostByShopPerPeriod,
  getCostByCategories,
  getCostByShops,
} = require('../controllers/statisticController');

const statisticRouter = new Router();

statisticRouter.get('/category-per-period', getCostByCategoryPerPeriod);
statisticRouter.get('/shop-per-period', getCostByShopPerPeriod);
statisticRouter.get('/categories', getCostByCategories);
statisticRouter.get('/shops', getCostByShops);

module.exports = statisticRouter;
