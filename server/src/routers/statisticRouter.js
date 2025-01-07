const { Router } = require('express');

const {
  getCostByCategories,
  getCostByEstablishments,
  getCostByProducts,
} = require('../controllers/statisticController');

const statisticRouter = new Router();

statisticRouter.route('/categories').get(getCostByCategories);

statisticRouter.route('/establishments').get(getCostByEstablishments);

statisticRouter.route('/products').get(getCostByProducts);

module.exports = statisticRouter;
