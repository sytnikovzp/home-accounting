const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateMeasure },
  pagination: { paginateElements },
} = require('../middlewares');

const {
  getAllMeasures,
  getMeasureByUuid,
  createMeasure,
  updateMeasure,
  deleteMeasure,
} = require('../controllers/measureController');

const measureRouter = new Router();

measureRouter
  .route('/')
  .get(authHandler, paginateElements, getAllMeasures)
  .post(authHandler, validateMeasure, createMeasure);

measureRouter
  .route('/:measureUuid')
  .get(authHandler, getMeasureByUuid)
  .patch(authHandler, validateMeasure, updateMeasure)
  .delete(authHandler, deleteMeasure);

module.exports = measureRouter;
