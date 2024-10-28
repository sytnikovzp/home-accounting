const { Router } = require('express');
// =====================================
const measureController = require('../controllers/measureController');
const {
  validate: { validateMeasure },
} = require('../middlewares');

const measureRouter = new Router();

measureRouter
  .route('/')
  .get(measureController.getAllMeasures)
  .post(validateMeasure, measureController.createMeasure)
  .put(validateMeasure, measureController.updateMeasure);

measureRouter
  .route('/:measureId')
  .get(measureController.getMeasureById)
  .delete(measureController.deleteMeasure);

module.exports = measureRouter;
