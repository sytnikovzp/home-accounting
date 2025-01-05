const { Router } = require('express');
// ==============================================================
const {
  getCostByCategoryPerPeriod,
  getCostByEstablishmentPerPeriod,
  getCostByProductPerPeriod,
  getCostByCategories,
  getCostByEstablishments,
  getCostByProducts,
} = require('../controllers/statisticController');

const statisticRouter = new Router();

statisticRouter.route('/category-per-period').get(getCostByCategoryPerPeriod);

statisticRouter
  .route('/establishment-per-period')
  .get(getCostByEstablishmentPerPeriod);

statisticRouter.route('/product-per-period').get(getCostByProductPerPeriod);

statisticRouter.route('/categories').get(getCostByCategories);

statisticRouter.route('/establishments').get(getCostByEstablishments);

statisticRouter.route('/products').get(getCostByProducts);

module.exports = statisticRouter;
