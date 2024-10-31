const {
  getCostByCategoryPerPeriod,
  getCostByShopPerPeriod,
  getCostByCategories,
  getCostByShops,
} = require('../services/statisticService');

class StatisticController {
  async getCostByCategoryPerPeriod(req, res, next) {
    try {
      const { category, ago } = req.query;
      const result = await getCostByCategoryPerPeriod(category, ago);
      res.status(200).json(result);
    } catch (error) {
      console.error('Get cost by category per period error: ', error.message);
      next(error);
    }
  }

  async getCostByShopPerPeriod(req, res, next) {
    try {
      const { shop, ago } = req.query;
      const result = await getCostByShopPerPeriod(shop, ago);
      res.status(200).json(result);
    } catch (error) {
      console.error('Get cost by shop per period error: ', error.message);
      next(error);
    }
  }

  async getCostByCategories(req, res, next) {
    try {
      const { ago } = req.query;
      const result = await getCostByCategories(ago);
      res.status(200).json(result);
    } catch (error) {
      console.error('Get cost by categories per period error: ', error.message);
      next(error);
    }
  }

  async getCostByShops(req, res, next) {
    try {
      const { ago } = req.query;
      const result = await getCostByShops(ago);
      res.status(200).json(result);
    } catch (error) {
      console.error('Get cost by shops per period error: ', error.message);
      next(error);
    }
  }
}

module.exports = new StatisticController();
