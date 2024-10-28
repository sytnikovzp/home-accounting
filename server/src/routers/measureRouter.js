const { Router } = require('express');
// =====================================
const measureController = require('../controllers/measureController');

const measureRouter = new Router();

measureRouter
  .route('/')
  .get(measureController.getAllMeasures)
  .post(measureController.createMeasure)
  .put(measureController.updateMeasure);

measureRouter
  .route('/:measureId')
  .get(measureController.getMeasureById)
  .delete(measureController.deleteMeasure);

module.exports = measureRouter;
