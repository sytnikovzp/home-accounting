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

measuresRouter.use(authHandler);

measuresRouter
  .route('/')
  .get(paginateElements, getAllMeasures)
  .post(validateMeasure, createMeasure);

measuresRouter
  .route('/:measureUuid')
  .get(getMeasureByUuid)
  .patch(validateMeasure, updateMeasure)
  .delete(deleteMeasure);

module.exports = measuresRouter;
