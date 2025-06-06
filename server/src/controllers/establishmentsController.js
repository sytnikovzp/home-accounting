const { sequelize } = require('../db/dbPostgres/models');

const {
  getAllEstablishments,
  getEstablishmentByUuid,
  createEstablishment,
  updateEstablishment,
  deleteEstablishment,
  changeEstablishmentLogo,
  resetEstablishmentLogo,
} = require('../services/establishmentsService');
const { getCurrentUser } = require('../services/usersService');

class EstablishmentsController {
  static async getAllEstablishments(req, res, next) {
    try {
      const {
        pagination: { limit, offset },
        query: { status = 'approved', sort = 'uuid', order = 'asc' },
      } = req;
      const { allEstablishments, totalCount } = await getAllEstablishments(
        status,
        limit,
        offset,
        sort,
        order
      );
      if (allEstablishments.length > 0) {
        res
          .status(200)
          .set('X-Total-Count', totalCount)
          .json(allEstablishments);
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
      const {
        params: { establishmentUuid },
      } = req;
      const establishmentByUuid =
        await getEstablishmentByUuid(establishmentUuid);
      if (establishmentByUuid) {
        res.status(200).json(establishmentByUuid);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get establishment by UUID error: ', error.message);
      next(error);
    }
  }

  static async createEstablishment(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        body: { title, description, url },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        params: { establishmentUuid },
        body: { title, description, url },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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

  static async changeEstablishmentLogo(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { establishmentUuid },
        file: { filename },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const updatedLogoEstablishment = await changeEstablishmentLogo(
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
      console.error('Change logo establishment error: ', error.message);
      next(error);
    }
  }

  static async resetEstablishmentLogo(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { establishmentUuid },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        params: { establishmentUuid },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
