const { Router } = require('express');

const {
  getCostByCategories,
  getCostByEstablishments,
  getCostByProducts,
} = require('../controllers/statisticsController');

const statisticsRouter = new Router();

statisticsRouter.route('/categories').get(getCostByCategories);

statisticsRouter.route('/establishments').get(getCostByEstablishments);

statisticsRouter.route('/products').get(getCostByProducts);

module.exports = statisticsRouter;
