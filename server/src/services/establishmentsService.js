const { Establishment } = require('../db/dbPostgres/models');

const {
  dataMapping: { STATUS_MODERATION_MAPPING },
} = require('../constants');
const { notFound, badRequest, forbidden } = require('../errors/generalErrors');
const {
  formatDateTime,
  isValidUUID,
  checkPermission,
  mapValue,
} = require('../utils/sharedFunctions');

const formatEstablishmentData = (establishment) => ({
  uuid: establishment.uuid,
  title: establishment.title,
  contentType: 'Заклад',
  description: establishment.description || '',
  url: establishment.url || '',
  logo: establishment.logo || '',
  status: mapValue(establishment.status, STATUS_MODERATION_MAPPING),
  moderation: {
    moderatorUuid: establishment.moderatorUuid || '',
    moderatorFullName: establishment.moderatorFullName || '',
  },
  creation: {
    creatorUuid: establishment.creatorUuid || '',
    creatorFullName: establishment.creatorFullName || '',
    createdAt: formatDateTime(establishment.createdAt),
    updatedAt: formatDateTime(establishment.updatedAt),
  },
});

class EstablishmentsService {
  static async getAllEstablishments(status, limit, offset, sort, order) {
    const foundEstablishments = await Establishment.findAll({
      attributes: ['uuid', 'title', 'logo'],
      where: { status },
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundEstablishments.length) {
      throw notFound('Заклади не знайдені');
    }
    const allEstablishments = foundEstablishments.map((establishment) => ({
      uuid: establishment.uuid,
      title: establishment.title,
      logo: establishment.logo || '',
    }));
    const total = await Establishment.count({ where: { status } });
    return {
      allEstablishments,
      total,
    };
  }

  static async getEstablishmentByUuid(uuid) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundEstablishment = await Establishment.findOne({ where: { uuid } });
    if (!foundEstablishment) {
      throw notFound('Заклад не знайдено');
    }
    return formatEstablishmentData(foundEstablishment.toJSON());
  }

  static async createEstablishment(
    title,
    description,
    url,
    currentUser,
    transaction
  ) {
    if (await Establishment.findOne({ where: { title } })) {
      throw badRequest('Цей заклад вже існує');
    }
    if (await Establishment.findOne({ where: { url } })) {
      throw badRequest('Цей URL вже використовується');
    }
    const canAddEstablishments = await checkPermission(
      currentUser,
      'ADD_ESTABLISHMENTS'
    );
    const canModerationEstablishments = await checkPermission(
      currentUser,
      'MODERATION_ESTABLISHMENTS'
    );
    if (!canAddEstablishments) {
      throw forbidden('Ви не маєте дозволу на додавання закладів');
    }
    const newEstablishment = await Establishment.create(
      {
        title,
        description: description || null,
        url: url || null,
        status: canModerationEstablishments ? 'approved' : 'pending',
        moderatorUuid: canModerationEstablishments ? currentUser.uuid : null,
        moderatorFullName: canModerationEstablishments
          ? currentUser.fullName
          : null,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newEstablishment) {
      throw badRequest('Дані цього закладу не створено');
    }
    return formatEstablishmentData(newEstablishment);
  }

  static async updateEstablishment(
    uuid,
    title,
    description,
    url,
    currentUser,
    transaction
  ) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundEstablishment = await Establishment.findOne({ where: { uuid } });
    if (!foundEstablishment) {
      throw notFound('Заклад не знайдено');
    }
    const canEditEstablishments = await checkPermission(
      currentUser,
      'EDIT_ESTABLISHMENTS'
    );
    const canModerationEstablishments = await checkPermission(
      currentUser,
      'MODERATION_ESTABLISHMENTS'
    );
    if (!canEditEstablishments && !canModerationEstablishments) {
      throw forbidden('Ви не маєте дозволу на редагування цього закладу');
    }
    if (title && title !== foundEstablishment.title) {
      const duplicateEstablishment = await Establishment.findOne({
        where: { title },
      });
      if (duplicateEstablishment) {
        throw badRequest('Цей заклад вже існує');
      }
    }
    if (url && url !== foundEstablishment.url) {
      const duplicateUrl = await Establishment.findOne({ where: { url } });
      if (duplicateUrl) {
        throw badRequest('Цей URL вже використовується');
      }
    }
    const [affectedRows, [updatedEstablishment]] = await Establishment.update(
      {
        title,
        description: description || null,
        url: url || null,
        status: canModerationEstablishments ? 'approved' : 'pending',
        moderatorUuid: canModerationEstablishments ? currentUser.uuid : null,
        moderatorFullName: canModerationEstablishments
          ? currentUser.fullName
          : null,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) {
      throw badRequest('Дані цього закладу не оновлено');
    }
    return formatEstablishmentData(updatedEstablishment);
  }

  static async changeEstablishmentLogo(
    uuid,
    filename,
    currentUser,
    transaction
  ) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundEstablishment = await Establishment.findOne({ where: { uuid } });
    if (!foundEstablishment) {
      throw notFound('Заклад не знайдено');
    }
    const canEditEstablishments = await checkPermission(
      currentUser,
      'EDIT_ESTABLISHMENTS'
    );
    const canModerationEstablishments = await checkPermission(
      currentUser,
      'MODERATION_ESTABLISHMENTS'
    );
    if (!canEditEstablishments && !canModerationEstablishments) {
      throw forbidden(
        'Ви не маєте дозволу на оновлення логотипу цього закладу'
      );
    }
    if (!filename) {
      throw badRequest('Файл не завантажено');
    }
    const [affectedRows, [updatedEstablishmentLogo]] =
      await Establishment.update(
        {
          logo: filename,
          status: canModerationEstablishments ? 'approved' : 'pending',
          moderatorUuid: canModerationEstablishments ? currentUser.uuid : null,
          moderatorFullName: canModerationEstablishments
            ? currentUser.fullName
            : null,
        },
        { where: { uuid }, returning: true, transaction }
      );
    if (!affectedRows) {
      throw badRequest('Логотип закладу не оновлено');
    }
    return formatEstablishmentData(updatedEstablishmentLogo);
  }

  static async resetEstablishmentLogo(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundEstablishment = await Establishment.findOne({ where: { uuid } });
    if (!foundEstablishment) {
      throw notFound('Заклад не знайдено');
    }
    const canEditEstablishments = await checkPermission(
      currentUser,
      'EDIT_ESTABLISHMENTS'
    );
    const canModerationEstablishments = await checkPermission(
      currentUser,
      'MODERATION_ESTABLISHMENTS'
    );
    if (!canEditEstablishments && !canModerationEstablishments) {
      throw forbidden(
        'Ви не маєте дозволу на видалення логотипу цього закладу'
      );
    }
    const [affectedRows, [removedEstablishmentLogo]] =
      await Establishment.update(
        {
          logo: null,
          status: canModerationEstablishments ? 'approved' : 'pending',
          moderatorUuid: canModerationEstablishments ? currentUser.uuid : null,
          moderatorFullName: canModerationEstablishments
            ? currentUser.fullName
            : null,
        },
        { where: { uuid }, returning: true, transaction }
      );
    if (!affectedRows) {
      throw badRequest('Логотип закладу не видалено');
    }
    return formatEstablishmentData(removedEstablishmentLogo);
  }

  static async deleteEstablishment(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundEstablishment = await Establishment.findOne({ where: { uuid } });
    if (!foundEstablishment) {
      throw notFound('Заклад не знайдено');
    }
    const canRemoveEstablishments = await checkPermission(
      currentUser,
      'REMOVE_ESTABLISHMENTS'
    );
    if (!canRemoveEstablishments) {
      throw forbidden('Ви не маєте дозволу на видалення цього закладу');
    }
    const deletedEstablishment = await Establishment.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedEstablishment) {
      throw badRequest('Дані цього закладу не видалено');
    }
    return deletedEstablishment;
  }
}

module.exports = EstablishmentsService;
