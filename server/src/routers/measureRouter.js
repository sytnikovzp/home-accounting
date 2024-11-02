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
  validation: { validateNewMeasure, validateUpdMeasure },
} = require('../middlewares');

const measureRouter = new Router();

measureRouter
  .route('/')
  .get(getAllMeasures)
  .post(validateNewMeasure, createMeasure);

measureRouter
  .route('/:measureId')
  .get(getMeasureById)
  .patch(validateUpdMeasure, updateMeasure)
  .delete(deleteMeasure);

module.exports = measureRouter;
