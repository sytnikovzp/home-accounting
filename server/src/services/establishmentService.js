const { Establishment } = require('../db/dbPostgres/models');

const {
  dataMapping: { statusModerationMapping },
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
  status: mapValue(establishment.status, statusModerationMapping),
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

class EstablishmentService {
  async getAllEstablishments(status, limit, offset, sort, order) {
    const foundEstablishments = await Establishment.findAll({
      attributes: ['uuid', 'title', 'logo'],
      where: { status },
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundEstablishments.length) throw notFound('Заклади не знайдені');
    const total = await Establishment.count({ where: { status } });
    return {
      allEstablishments: foundEstablishments,
      total,
    };
  }

  async getEstablishmentByUuid(uuid) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundEstablishment = await Establishment.findOne({ where: { uuid } });
    if (!foundEstablishment) throw notFound('Заклад не знайдено');
    return formatEstablishmentData(foundEstablishment.toJSON());
  }

  async createEstablishment(title, description, url, currentUser, transaction) {
    const canAddEstablishments = await checkPermission(
      currentUser,
      'ADD_ESTABLISHMENTS'
    );
    const canManageEstablishments = await checkPermission(
      currentUser,
      'MANAGE_ESTABLISHMENTS'
    );
    if (!canAddEstablishments && !canManageEstablishments)
      throw forbidden('Ви не маєте дозволу на створення закладів');
    if (await Establishment.findOne({ where: { title } }))
      throw badRequest('Цей заклад вже існує');
    if (await Establishment.findOne({ where: { url } }))
      throw badRequest('Цей URL вже використовується');
    const newEstablishment = await Establishment.create(
      {
        title,
        description: description || null,
        url: url || null,
        status: canManageEstablishments ? 'approved' : 'pending',
        moderatorUuid: canManageEstablishments ? currentUser.uuid : null,
        moderatorFullName: canManageEstablishments
          ? currentUser.fullName
          : null,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newEstablishment) throw badRequest('Дані цього закладу не створено');
    return formatEstablishmentData(newEstablishment);
  }

  async updateEstablishment(
    uuid,
    title,
    description,
    url,
    currentUser,
    transaction
  ) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundEstablishment = await Establishment.findOne({ where: { uuid } });
    if (!foundEstablishment) throw notFound('Заклад не знайдено');
    const isOwner = currentUser.uuid === foundEstablishment.creatorUuid;
    const canManageEstablishments = await checkPermission(
      currentUser,
      'MANAGE_ESTABLISHMENTS'
    );
    if (!isOwner && !canManageEstablishments)
      throw forbidden('Ви не маєте дозволу на редагування цього закладу');
    if (title && title !== foundEstablishment.title) {
      const duplicateEstablishment = await Establishment.findOne({
        where: { title },
      });
      if (duplicateEstablishment) throw badRequest('Цей заклад вже існує');
    }
    if (url && url !== foundEstablishment.url) {
      const duplicateUrl = await Establishment.findOne({ where: { url } });
      if (duplicateUrl) throw badRequest('Цей URL вже використовується');
    }
    const [affectedRows, [updatedEstablishment]] = await Establishment.update(
      {
        title,
        description: description || null,
        url: url || null,
        status: canManageEstablishments ? 'approved' : 'pending',
        moderatorUuid: canManageEstablishments ? currentUser.uuid : null,
        moderatorFullName: canManageEstablishments
          ? currentUser.fullName
          : null,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Дані цього закладу не оновлено');
    return formatEstablishmentData(updatedEstablishment);
  }

  async updateEstablishmentLogo(uuid, filename, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    if (!filename) throw badRequest('Файл не завантажено');
    const foundEstablishment = await Establishment.findOne({ where: { uuid } });
    if (!foundEstablishment) throw notFound('Заклад не знайдено');
    const isOwner = currentUser.uuid === foundEstablishment.creatorUuid;
    const canManageEstablishments = await checkPermission(
      currentUser,
      'MANAGE_ESTABLISHMENTS'
    );
    if (!isOwner && !canManageEstablishments)
      throw forbidden(
        'Ви не маєте дозволу на оновлення логотипу цього закладу'
      );
    const [affectedRows, [updatedEstablishmentLogo]] =
      await Establishment.update(
        {
          logo: filename,
          status: canManageEstablishments ? 'approved' : 'pending',
          moderatorUuid: canManageEstablishments ? currentUser.uuid : null,
          moderatorFullName: canManageEstablishments
            ? currentUser.fullName
            : null,
        },
        { where: { uuid }, returning: true, transaction }
      );
    if (!affectedRows) throw badRequest('Логотип закладу не оновлено');
    return formatEstablishmentData(updatedEstablishmentLogo);
  }

  async removeEstablishmentLogo(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundEstablishment = await Establishment.findOne({ where: { uuid } });
    if (!foundEstablishment) throw notFound('Заклад не знайдено');
    const isOwner = currentUser.uuid === foundEstablishment.creatorUuid;
    const canManageEstablishments = await checkPermission(
      currentUser,
      'MANAGE_ESTABLISHMENTS'
    );
    if (!isOwner && !canManageEstablishments)
      throw forbidden(
        'Ви не маєте дозволу на видалення логотипу цього закладу'
      );
    const [affectedRows, [removedEstablishmentLogo]] =
      await Establishment.update(
        {
          logo: null,
          status: canManageEstablishments ? 'approved' : 'pending',
          moderatorUuid: canManageEstablishments ? currentUser.uuid : null,
          moderatorFullName: canManageEstablishments
            ? currentUser.fullName
            : null,
        },
        { where: { uuid }, returning: true, transaction }
      );
    if (!affectedRows) throw badRequest('Логотип закладу не видалено');
    return formatEstablishmentData(removedEstablishmentLogo);
  }

  async deleteEstablishment(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const canManageEstablishments = await checkPermission(
      currentUser,
      'MANAGE_ESTABLISHMENTS'
    );
    if (!canManageEstablishments)
      throw forbidden('Ви не маєте дозволу на видалення цього закладу');
    const foundEstablishment = await Establishment.findOne({ where: { uuid } });
    if (!foundEstablishment) throw notFound('Заклад не знайдено');
    const deletedEstablishment = await Establishment.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedEstablishment)
      throw badRequest('Дані цього закладу не видалено');
    return deletedEstablishment;
  }
}

module.exports = new EstablishmentService();
