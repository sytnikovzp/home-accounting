const {
  getCostByCategories,
  getCostByEstablishments,
  getCostByProducts,
} = require('../services/statisticService');

class StatisticController {
  async getCostByCategories(req, res, next) {
    try {
      const { ago = 'allTime' } = req.query;
      const result = await getCostByCategories(ago);
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get cost by categories per period error: ', error.message);
      next(error);
    }
  }

  async getCostByEstablishments(req, res, next) {
    try {
      const { ago = 'allTime' } = req.query;
      const result = await getCostByEstablishments(ago);
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error(
        'Get cost by establishments per period error: ',
        error.message
      );
      next(error);
    }
  }

  async getCostByProducts(req, res, next) {
    try {
      const { ago = 'allTime' } = req.query;
      const result = await getCostByProducts(ago);
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get cost by products per period error: ', error.message);
      next(error);
    }
  }
}

module.exports = new StatisticController();
