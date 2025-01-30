const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateEstablishment },
  pagination: { paginateElements },
  upload: { uploadEstablishmentLogo },
} = require('../middlewares');

const {
  getAllEstablishments,
  getEstablishmentByUuid,
  createEstablishment,
  updateEstablishment,
  changeEstablishmentLogo,
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
    uploadEstablishmentLogo.single('establishmentLogo'),
    changeEstablishmentLogo
  )
  .delete(resetEstablishmentLogo);

establishmentsRouter
  .route('/:establishmentUuid')
  .get(getEstablishmentByUuid)
  .patch(validateEstablishment, updateEstablishment)
  .delete(deleteEstablishment);

module.exports = establishmentsRouter;
