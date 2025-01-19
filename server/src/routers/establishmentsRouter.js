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
  resetEstablishmentLogo,
  deleteEstablishment,
} = require('../controllers/establishmentsController');

const establishmentsRouter = new Router();

establishmentsRouter.use(authHandler);

establishmentsRouter
  .route('/')
  .get(paginateElements, getAllEstablishments)
  .post(validateEstablishment, createEstablishment);

establishmentsRouter
  .route('/:establishmentUuid/logo')
  .patch(
    uploadEstablishmentLogos.single('establishmentLogo'),
    updateEstablishmentLogo
  );

establishmentsRouter
  .route('/:establishmentUuid/logo/reset')
  .patch(resetEstablishmentLogo);

establishmentsRouter
  .route('/:establishmentUuid')
  .get(getEstablishmentByUuid)
  .patch(validateEstablishment, updateEstablishment)
  .delete(deleteEstablishment);

module.exports = establishmentsRouter;
