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
} = require('../controllers/measuresController');

const measuresRouter = new Router();

measuresRouter
  .route('/')
  .get(authHandler, paginateElements, getAllMeasures)
  .post(authHandler, validateMeasure, createMeasure);

measuresRouter
  .route('/:measureUuid')
  .get(authHandler, getMeasureByUuid)
  .patch(authHandler, validateMeasure, updateMeasure)
  .delete(authHandler, deleteMeasure);

module.exports = measuresRouter;
