const { Router } = require('express');
// ==============================================================
const {
  getAllMeasures,
  createMeasure,
  updateMeasure,
  getMeasureById,
  deleteMeasure,
} = require('../controllers/measureController');
const {
  validation: { validateMeasure },
} = require('../middlewares');

const measureRouter = new Router();

measureRouter
  .route('/')
  .get(getAllMeasures)
  .post(validateMeasure, createMeasure);

measureRouter
  .route('/:measureId')
  .get(getMeasureById)
  .patch(validateMeasure, updateMeasure)
  .delete(deleteMeasure);

module.exports = measureRouter;
