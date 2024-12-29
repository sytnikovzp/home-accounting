const { Router } = require('express');
// ==============================================================
const {
  getAllEstablishments,
  getEstablishmentByUuid,
  createEstablishment,
  updateEstablishment,
  updateEstablishmentLogo,
  removeEstablishmentLogo,
  deleteEstablishment,
} = require('../controllers/establishmentController');
const {
  auth: { authHandler },
  validation: { validateEstablishment },
  pagination: { paginateElements },
  upload: { uploadEstablishmentLogos },
} = require('../middlewares');

const establishmentRouter = new Router();

establishmentRouter
  .route('/')
  .get(authHandler, paginateElements, getAllEstablishments)
  .post(authHandler, validateEstablishment, createEstablishment);

establishmentRouter
  .route('/update-logo/:establishmentUuid')
  .patch(
    authHandler,
    uploadEstablishmentLogos.single('establishmentLogo'),
    updateEstablishmentLogo
  );

establishmentRouter
  .route('/delete-logo/:establishmentUuid')
  .patch(authHandler, removeEstablishmentLogo);

establishmentRouter
  .route('/:establishmentUuid')
  .get(authHandler, getEstablishmentByUuid)
  .patch(authHandler, validateEstablishment, updateEstablishment)
  .delete(authHandler, deleteEstablishment);

module.exports = establishmentRouter;
