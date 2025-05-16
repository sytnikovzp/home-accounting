const { Product, Category } = require('../db/dbPostgres/models');

const {
  DATA_MAPPING: { STATUS_MODERATION_MAPPING },
} = require('../constants');
const { notFound, badRequest, forbidden } = require('../errors/generalErrors');
const { checkPermission } = require('../utils/authHelpers');
const { formatDateTime } = require('../utils/dateHelpers');
const { getRecordByTitle } = require('../utils/dbHelpers');
const { mapValue } = require('../utils/stringUtils');
const { isValidUUID } = require('../utils/validators');

const formatProductData = (product) => ({
  uuid: product.uuid,
  title: product.title,
  contentType: 'Товар',
  status: mapValue(product.status, STATUS_MODERATION_MAPPING),
  moderation: {
    moderatorUuid: product.moderatorUuid || '',
    moderatorFullName: product.moderatorFullName || '',
  },
  creation: {
    creatorUuid: product.creatorUuid || '',
    creatorFullName: product.creatorFullName || '',
    createdAt: formatDateTime(product.createdAt),
    updatedAt: formatDateTime(product.updatedAt),
  },
});

class ProductsService {
  static async getAllProducts(status, limit, offset, sort, order) {
    const sortableFields = {
      category: [Category, 'title'],
    };
    const orderConfig = sortableFields[sort]
      ? [...sortableFields[sort], order]
      : [['uuid', 'title'].includes(sort) ? sort : `Expense.${sort}`, order];
    const foundProducts = await Product.findAll({
      attributes: ['uuid', 'title'],
      where: { status },
      include: [{ model: Category, attributes: ['title'] }],
      order: [orderConfig],
      raw: true,
      limit,
      offset,
    });
    if (!foundProducts.length) {
      throw notFound('Товарів не знайдено');
    }
    const allProducts = foundProducts.map(
      ({ uuid, title, 'Category.title': categoryTitle }) => ({
        uuid,
        title,
        category: categoryTitle || '',
      })
    );
    const totalCount = await Product.count({ where: { status } });
    return {
      allProducts,
      totalCount,
    };
  }

  static async getProductByUuid(uuid) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundProduct = await Product.findByPk(uuid, {
      attributes: { exclude: ['categoryUuid'] },
      include: [{ model: Category, attributes: ['uuid', 'title'] }],
    });
    if (!foundProduct) {
      throw notFound('Товар/послугу не знайдено');
    }
    const productData = {
      ...foundProduct.toJSON(),
      categoryUuid: foundProduct.Category?.uuid || '',
      categoryTitle: foundProduct.Category?.title || '',
    };
    return {
      ...formatProductData(productData),
      category: {
        uuid: productData.categoryUuid,
        title: productData.categoryTitle,
      },
    };
  }

  static async createProduct(title, categoryValue, currentUser, transaction) {
    if (await Product.findOne({ where: { title } })) {
      throw badRequest('Цей товар вже існує');
    }
    const canAddProducts = await checkPermission(currentUser, 'ADD_PRODUCTS');
    const canModerationProducts = await checkPermission(
      currentUser,
      'MODERATION_PRODUCTS'
    );
    if (!canAddProducts) {
      throw forbidden('Ви не маєте дозволу на додавання товарів');
    }
    const categoryRecord = categoryValue
      ? await getRecordByTitle(Category, categoryValue)
      : null;
    const newProduct = await Product.create(
      {
        title,
        categoryUuid: categoryRecord?.uuid || null,
        status: canModerationProducts ? 'approved' : 'pending',
        moderatorUuid: canModerationProducts ? currentUser.uuid : null,
        moderatorFullName: canModerationProducts ? currentUser.fullName : null,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newProduct) {
      throw badRequest('Дані цього товару не створено');
    }
    return formatProductData(newProduct);
  }

  static async updateProduct(
    uuid,
    title,
    categoryValue,
    currentUser,
    transaction
  ) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundProduct = await Product.findByPk(uuid);
    if (!foundProduct) {
      throw notFound('Товар/послугу не знайдено');
    }
    const canEditProducts = await checkPermission(currentUser, 'EDIT_PRODUCTS');
    const canModerationProducts = await checkPermission(
      currentUser,
      'MODERATION_PRODUCTS'
    );
    if (!canEditProducts && !canModerationProducts) {
      throw forbidden('Ви не маєте дозволу на редагування цього товару');
    }
    if (title && title !== foundProduct.title) {
      const duplicateProduct = await Product.findOne({ where: { title } });
      if (duplicateProduct) {
        throw badRequest('Цей товар вже існує');
      }
    }
    const categoryRecord = categoryValue
      ? await getRecordByTitle(Category, categoryValue)
      : null;
    const [affectedRows, [updatedProduct]] = await Product.update(
      {
        title,
        categoryUuid: categoryRecord?.uuid || null,
        status: canModerationProducts ? 'approved' : 'pending',
        moderatorUuid: canModerationProducts ? currentUser.uuid : null,
        moderatorFullName: canModerationProducts ? currentUser.fullName : null,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) {
      throw badRequest('Дані цього товару не оновлено');
    }
    return formatProductData(updatedProduct);
  }

  static async deleteProduct(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundProduct = await Product.findByPk(uuid);
    if (!foundProduct) {
      throw notFound('Товар/послугу не знайдено');
    }
    const canRemoveProducts = await checkPermission(
      currentUser,
      'REMOVE_PRODUCTS'
    );
    if (!canRemoveProducts) {
      throw forbidden('Ви не маєте дозволу на видалення цього товару');
    }
    const deletedProduct = await Product.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedProduct) {
      throw badRequest('Дані цього товару не видалено');
    }
    return deletedProduct;
  }
}

module.exports = ProductsService;
