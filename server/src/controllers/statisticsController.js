const {
  getCostByCategories,
  getCostByEstablishments,
  getCostByProducts,
} = require('../services/statisticsService');

class StatisticsController {
  static async getCostByCategories(req, res, next) {
    try {
      const { ago = 'allTime', creatorUuid = null } = req.query;
      const result = await getCostByCategories(ago, creatorUuid);
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

  static async getCostByEstablishments(req, res, next) {
    try {
      const { ago = 'allTime', creatorUuid = null } = req.query;
      const result = await getCostByEstablishments(ago, creatorUuid);
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

  static async getCostByProducts(req, res, next) {
    try {
      const { ago = 'allTime', creatorUuid = null } = req.query;
      const result = await getCostByProducts(ago, creatorUuid);
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

module.exports = StatisticsController;
