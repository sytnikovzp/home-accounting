const { Product, Category } = require('../db/dbPostgres/models');
const {
  dataMapping: { statusModerationMapping },
} = require('../constants');
const {
  formatDateTime,
  isValidUUID,
  checkPermission,
  mapValue,
  getRecordByTitle,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/generalErrors');

const formatProductData = (product) => ({
  uuid: product.uuid,
  title: product.title,
  contentType: 'Товар',
  status: mapValue(product.status, statusModerationMapping),
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

class ProductService {
  async getAllProducts(status, limit, offset, sort, order) {
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
    if (!foundProducts.length) throw notFound('Товарів не знайдено');
    const total = await Product.count({ where: { status } });
    return {
      allProducts: foundProducts.map(
        ({ uuid, title, 'Category.title': categoryTitle }) => ({
          uuid,
          title,
          category: categoryTitle || '',
        })
      ),
      total,
    };
  }

  async getProductByUuid(uuid) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundProduct = await Product.findOne({
      where: { uuid },
      attributes: { exclude: ['categoryUuid'] },
      include: [{ model: Category, attributes: ['uuid', 'title'] }],
    });
    if (!foundProduct) throw notFound('Товар не знайдено');
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

  async createProduct(title, category, currentUser, transaction) {
    const canAddProducts = await checkPermission(currentUser, 'ADD_PRODUCTS');
    const canManageProducts = await checkPermission(
      currentUser,
      'MANAGE_PRODUCTS'
    );
    if (!canAddProducts && !canManageProducts)
      throw forbidden('Ви не маєте дозволу на створення товарів');
    if (await Product.findOne({ where: { title } })) {
      throw badRequest('Цей товар вже існує');
    }
    const categoryRecord = category
      ? await getRecordByTitle(Category, category)
      : null;
    const newProduct = await Product.create(
      {
        title,
        categoryUuid: categoryRecord?.uuid || null,
        status: canManageProducts ? 'approved' : 'pending',
        moderatorUuid: canManageProducts ? currentUser.uuid : null,
        moderatorFullName: canManageProducts ? currentUser.fullName : null,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newProduct) throw badRequest('Дані цього товару не створено');
    return formatProductData(newProduct);
  }

  async updateProduct(uuid, title, category, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundProduct = await Product.findOne({ where: { uuid } });
    if (!foundProduct) throw notFound('Товар не знайдено');
    const isOwner = currentUser.uuid === foundProduct.creatorUuid;
    const canManageProducts = await checkPermission(
      currentUser,
      'MANAGE_PRODUCTS'
    );
    if (!isOwner && !canManageProducts)
      throw forbidden('Ви не маєте дозволу на редагування цього товару');
    if (title && title !== foundProduct.title) {
      const duplicateProduct = await Product.findOne({ where: { title } });
      if (duplicateProduct) throw badRequest('Цей товар вже існує');
    }
    const categoryRecord = category
      ? await getRecordByTitle(Category, category)
      : null;
    const [affectedRows, [updatedProduct]] = await Product.update(
      {
        title,
        categoryUuid: categoryRecord?.uuid || null,
        status: canManageProducts ? 'approved' : 'pending',
        moderatorUuid: canManageProducts ? currentUser.uuid : null,
        moderatorFullName: canManageProducts ? currentUser.fullName : null,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Дані цього товару не оновлено');
    return formatProductData(updatedProduct);
  }

  async deleteProduct(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const canManageProducts = await checkPermission(
      currentUser,
      'MANAGE_PRODUCTS'
    );
    if (!canManageProducts)
      throw forbidden('Ви не маєте дозволу на видалення цього товару');
    const foundProduct = await Product.findOne({ where: { uuid } });
    if (!foundProduct) throw notFound('Товар не знайдено');
    const deletedProduct = await Product.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedProduct) throw badRequest('Дані цього товару не видалено');
    return deletedProduct;
  }
}

module.exports = new ProductService();
