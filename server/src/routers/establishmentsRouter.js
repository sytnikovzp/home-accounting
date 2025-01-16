const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateEstablishment },
  pagination: { paginateElements },
  upload: { uploadEstablishmentLogos },
} = require('../middlewares');

const {
  getAllEstablishments,
  getEstablishmentByUuid,
  createEstablishment,
  updateEstablishment,
  updateEstablishmentLogo,
  deleteEstablishmentLogo,
  deleteEstablishment,
} = require('../controllers/establishmentsController');

const establishmentsRouter = new Router();

establishmentsRouter
  .route('/')
  .get(authHandler, paginateElements, getAllEstablishments)
  .post(authHandler, validateEstablishment, createEstablishment);

establishmentsRouter
  .route('/update-logo/:establishmentUuid')
  .patch(
    authHandler,
    uploadEstablishmentLogos.single('establishmentLogo'),
    updateEstablishmentLogo
  );

establishmentsRouter
  .route('/delete-logo/:establishmentUuid')
  .patch(authHandler, deleteEstablishmentLogo);

establishmentsRouter
  .route('/:establishmentUuid')
  .get(authHandler, getEstablishmentByUuid)
  .patch(authHandler, validateEstablishment, updateEstablishment)
  .delete(authHandler, deleteEstablishment);

module.exports = establishmentsRouter;
