const { sequelize } = require('../db/dbPostgres/models');

const {
  getAllEstablishments,
  getEstablishmentByUuid,
  createEstablishment,
  updateEstablishment,
  deleteEstablishment,
  updateEstablishmentLogo,
  resetEstablishmentLogo,
} = require('../services/establishmentsService');
const { getCurrentUser } = require('../services/usersService');

class EstablishmentsController {
  static async getAllEstablishments(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { status = 'approved', sort = 'uuid', order = 'asc' } = req.query;
      const { allEstablishments, total } = await getAllEstablishments(
        status,
        limit,
        offset,
        sort,
        order
      );
      if (allEstablishments.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allEstablishments);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get all establishments error: ', error.message);
      next(error);
    }
  }

  static async getEstablishmentByUuid(req, res, next) {
    try {
      const { establishmentUuid } = req.params;
      const establishment = await getEstablishmentByUuid(establishmentUuid);
      if (establishment) {
        res.status(200).json(establishment);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get establishment by uuid error: ', error.message);
      next(error);
    }
  }

  static async createEstablishment(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, description, url } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const newEstablishment = await createEstablishment(
        title,
        description,
        url,
        currentUser,
        transaction
      );
      if (newEstablishment) {
        await transaction.commit();
        res.status(201).json(newEstablishment);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Create establishment error: ', error.message);
      next(error);
    }
  }

  static async updateEstablishment(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { establishmentUuid } = req.params;
      const { title, description, url } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedEstablishment = await updateEstablishment(
        establishmentUuid,
        title,
        description,
        url,
        currentUser,
        transaction
      );
      if (updatedEstablishment) {
        await transaction.commit();
        res.status(200).json(updatedEstablishment);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Update establishment error: ', error.message);
      next(error);
    }
  }

  static async updateEstablishmentLogo(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { establishmentUuid },
        file: { filename },
      } = req;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedLogoEstablishment = await updateEstablishmentLogo(
        establishmentUuid,
        filename,
        currentUser,
        transaction
      );
      if (updatedLogoEstablishment) {
        await transaction.commit();
        res.status(200).json(updatedLogoEstablishment);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Update logo establishment error: ', error.message);
      next(error);
    }
  }

  static async resetEstablishmentLogo(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { establishmentUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedEstablishment = await resetEstablishmentLogo(
        establishmentUuid,
        currentUser,
        transaction
      );
      if (updatedEstablishment) {
        await transaction.commit();
        res.status(200).json(updatedEstablishment);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Remove logo establishment error: ', error.message);
      next(error);
    }
  }

  static async deleteEstablishment(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { establishmentUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.uuid);
      const deletedEstablishment = await deleteEstablishment(
        establishmentUuid,
        currentUser,
        transaction
      );
      if (deletedEstablishment) {
        await transaction.commit();
        res.status(200).json('OK');
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Delete establishment error: ', error.message);
      next(error);
    }
  }
}

module.exports = EstablishmentsController;
