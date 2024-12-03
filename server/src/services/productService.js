const { Product, Category } = require('../db/dbPostgres/models');
const {
  formatDate,
  checkPermission,
  mapStatus,
  getRecordByTitle,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

const formatProductData = (product) => ({
  id: product.id,
  title: product.title,
  status: mapStatus(product.status),
  moderation: {
    moderatorId: product.moderatorId || '',
    moderatorFullName: product.moderatorFullName || '',
  },
  creation: {
    creatorId: product.creatorId || '',
    creatorFullName: product.creatorFullName || '',
    createdAt: formatDate(product.createdAt),
    updatedAt: formatDate(product.updatedAt),
  },
});

class ProductService {
  async getAllProducts(status, limit, offset, sort = 'id', order = 'asc') {
    const foundProducts = await Product.findAll({
      attributes: ['id', 'title'],
      where: { status },
      include: [{ model: Category, attributes: ['title'] }],
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundProducts.length) throw notFound('Товарів не знайдено');
    const total = await Product.count({ where: { status } });
    return {
      allProducts: foundProducts.map(
        ({ id, title, 'Category.title': categoryTitle }) => ({
          id,
          title,
          category: categoryTitle || '',
        })
      ),
      total,
    };
  }

  async getProductById(productId) {
    const foundProduct = await Product.findByPk(productId, {
      attributes: { exclude: ['categoryId'] },
      include: [{ model: Category, attributes: ['title'] }],
    });
    if (!foundProduct) throw notFound('Товар не знайдено');
    const productData = {
      ...foundProduct.toJSON(),
      category: foundProduct.Category?.title || '',
    };
    return {
      ...formatProductData(productData),
      category: productData.category,
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
        categoryId: categoryRecord?.id || null,
        status: canManageProducts ? 'approved' : 'pending',
        moderatorId: canManageProducts ? currentUser.id.toString() : null,
        moderatorFullName: canManageProducts ? currentUser.fullName : null,
        creatorId: currentUser.id.toString(),
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newProduct) throw badRequest('Дані цього товару не створено');
    return formatProductData(newProduct);
  }

  async updateProduct(id, title, category, currentUser, transaction) {
    const foundProduct = await Product.findByPk(id);
    if (!foundProduct) throw notFound('Товар не знайдено');
    const isOwner = currentUser.id.toString() === foundProduct.creatorId;
    const canManageProducts = await checkPermission(
      currentUser,
      'MANAGE_PRODUCTS'
    );
    if (!isOwner && !canManageProducts)
      throw forbidden('Ви не маєте дозволу на редагування цього товару');
    if (title !== foundProduct.title) {
      const duplicateProduct = await Product.findOne({ where: { title } });
      if (duplicateProduct) throw badRequest('Цей товар вже існує');
    }
    const categoryRecord = category
      ? await getRecordByTitle(Category, category)
      : null;
    const updateData = {
      title,
      categoryId: categoryRecord?.id || null,
      status: canManageProducts ? 'approved' : 'pending',
      moderatorId: canManageProducts ? currentUser.id.toString() : null,
      moderatorFullName: canManageProducts ? currentUser.fullName : null,
    };
    const [affectedRows, [updatedProduct]] = await Product.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
    if (!affectedRows) throw badRequest('Дані цього товару не оновлено');
    return formatProductData(updatedProduct);
  }

  async updateProductStatus(id, status, currentUser, transaction) {
    const hasPermission = await checkPermission(
      currentUser,
      'MODERATE_PRODUCTS'
    );
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на модерацію товарів');
    const foundProduct = await Product.findByPk(id);
    if (!foundProduct) throw notFound('Товар не знайдено');
    if (!['approved', 'rejected'].includes(status))
      throw notFound('Статус не знайдено');
    const updateData = {
      status,
      moderatorId: currentUser.id.toString(),
      moderatorFullName: currentUser.fullName,
    };
    const [affectedRows, [moderatedProduct]] = await Product.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Товар не проходить модерацію');
    return formatProductData(moderatedProduct);
  }

  async deleteProduct(productId, currentUser, transaction) {
    const hasPermission = await checkPermission(currentUser, 'MANAGE_PRODUCTS');
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на видалення цього товару');
    const foundProduct = await Product.findByPk(productId);
    if (!foundProduct) throw notFound('Товар не знайдено');
    const deletedProduct = await Product.destroy({
      where: { id: productId },
      transaction,
    });
    if (!deletedProduct) throw badRequest('Дані цього товару не видалено');
    return deletedProduct;
  }
}

module.exports = new ProductService();
