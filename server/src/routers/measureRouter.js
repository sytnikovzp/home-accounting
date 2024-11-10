const { Router } = require('express');
// ==============================================================
const {
  getAllMeasures,
  getMeasureById,
  createMeasure,
  updateMeasure,
  deleteMeasure,
} = require('../controllers/measureController');
const {
  auth: { authHandler },
  validation: { validateMeasure },
} = require('../middlewares');

const measureRouter = new Router();

measureRouter
  .route('/')
  .get(authHandler, getAllMeasures)
  .post(authHandler, validateMeasure, createMeasure);

measureRouter
  .route('/:measureId')
  .get(authHandler, getMeasureById)
  .patch(authHandler, validateMeasure, updateMeasure)
  .delete(authHandler, deleteMeasure);

module.exports = measureRouter;
