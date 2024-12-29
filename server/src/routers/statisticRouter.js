const { Router } = require('express');
// ==============================================================
const {
  getCostByCategoryPerPeriod,
  getCostByEstablishmentPerPeriod,
  getCostByCategories,
  getCostByEstablishments,
} = require('../controllers/statisticController');

const statisticRouter = new Router();

statisticRouter
  .route('/category-per-period')
  .get(getCostByCategoryPerPeriod);

statisticRouter
  .route('/establishment-per-period')
  .get(getCostByEstablishmentPerPeriod);

statisticRouter
  .route('/categories')
  .get(getCostByCategories);

statisticRouter
  .route('/establishments')
  .get(getCostByEstablishments);

module.exports = statisticRouter;
