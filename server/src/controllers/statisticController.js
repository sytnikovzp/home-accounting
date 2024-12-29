const {
  getCostByCategoryPerPeriod,
  getCostByEstablishmentPerPeriod,
  getCostByCategories,
  getCostByEstablishments,
} = require('../services/statisticService');

class StatisticController {
  async getCostByCategoryPerPeriod(req, res, next) {
    try {
      const { category, ago } = req.query;
      const result = await getCostByCategoryPerPeriod(category, ago);
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get cost by category per period error: ', error.message);
      next(error);
    }
  }

  async getCostByEstablishmentPerPeriod(req, res, next) {
    try {
      const { establishment, ago } = req.query;
      const result = await getCostByEstablishmentPerPeriod(establishment, ago);
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error(
        'Get cost by establishment per period error: ',
        error.message
      );
      next(error);
    }
  }

  async getCostByCategories(req, res, next) {
    try {
      const { ago } = req.query;
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
      const { ago } = req.query;
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
}

module.exports = new StatisticController();
