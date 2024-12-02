const { Product, Category } = require('../db/dbPostgres/models');
const {
  formatDate,
  getRecordByTitle,
  checkPermission,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

class ProductService {
  async getAllProducts(status, limit, offset) {
    const foundProducts = await Product.findAll({
      attributes: ['id', 'title'],
      where: { status },
      include: [{ model: Category, attributes: ['title'] }],
      raw: true,
      limit,
      offset,
    });
    if (foundProducts.length === 0) throw notFound('Товарів не знайдено');
    const allProducts = foundProducts.map((product) => ({
      id: product.id,
      title: product.title,
      category: product['Category.title'] || '',
    }));
    const total = await Product.count({
      where: { status },
    });
    return {
      allProducts,
      total,
    };
  }

  async getProductById(productId) {
    const foundProduct = await Product.findByPk(productId, {
      attributes: { exclude: ['categoryId'] },
      include: [{ model: Category, attributes: ['title'] }],
    });
    if (!foundProduct) throw notFound('Товар не знайдено');
    const productData = foundProduct.toJSON();
    const statusMapping = {
      approved: 'Затверджено',
      pending: 'Очікує модерації',
      rejected: 'Відхилено',
    };
    return {
      id: productData.id,
      title: productData.title,
      category: productData.Category?.title || '',
      status: statusMapping[productData.status] || productData.status,
      reviewedBy: productData.reviewedBy || '',
      reviewedAt: productData.reviewedAt
        ? formatDate(productData.reviewedAt)
        : '',
      createdBy: productData.createdBy || '',
      createdAt: formatDate(productData.createdAt),
      updatedAt: formatDate(productData.updatedAt),
    };
  }

  async updateProductStatus(id, status, currentUser, transaction) {
    const hasPermission = await checkPermission(
      currentUser,
      'MODERATE_PRODUCTS'
    );
    if (!hasPermission) {
      throw forbidden('Ви не маєте дозволу на модерацію товарів');
    }
    const foundProduct = await Product.findByPk(id);
    if (!foundProduct) throw notFound('Товар не знайдено');
    if (!['approved', 'rejected'].includes(status)) {
      throw notFound('Статус не знайдено');
    }
    const currentUserId = currentUser.id.toString();
    const updateData = { status };
    updateData.reviewedBy = currentUserId;
    updateData.reviewedAt = new Date();
    const [affectedRows, [moderatedProduct]] = await Product.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (affectedRows === 0) throw badRequest('Товар не проходить модерацію');
    return {
      id: moderatedProduct.id,
      title: moderatedProduct.title,
      status: moderatedProduct.status,
      reviewedBy: moderatedProduct.reviewedBy,
      reviewedAt: formatDate(moderatedProduct.reviewedAt),
      createdBy: moderatedProduct.createdBy || '',
    };
  }

  async createProduct(title, category, currentUser, transaction) {
    const canAddProducts = await checkPermission(currentUser, 'ADD_PRODUCTS');
    const canManageProducts = await checkPermission(
      currentUser,
      'MANAGE_PRODUCTS'
    );
    if (!canAddProducts && !canManageProducts) {
      throw forbidden('Ви не маєте дозволу на створення товарів');
    }
    const duplicateProduct = await Product.findOne({ where: { title } });
    if (duplicateProduct) throw badRequest('Цей товар вже існує');
    let categoryRecord = null;
    if (category !== undefined) {
      categoryRecord = await getRecordByTitle(Category, category);
    }
    const currentUserId = currentUser.id.toString();
    const status = canManageProducts ? 'approved' : 'pending';
    const reviewedBy = canManageProducts ? currentUserId : null;
    const reviewedAt = canManageProducts ? new Date() : null;
    const createdBy = currentUserId;
    const newProduct = await Product.create(
      {
        title,
        categoryId: categoryRecord?.id || null,
        status,
        reviewedBy,
        reviewedAt,
        createdBy,
      },
      { transaction, returning: true }
    );
    if (!newProduct) throw badRequest('Дані цього товару не створено');
    return {
      id: newProduct.id,
      title: newProduct.title,
      category: categoryRecord?.title || '',
      status: newProduct.status,
      reviewedBy: newProduct.reviewedBy || '',
      reviewedAt: newProduct.reviewedAt
        ? formatDate(newProduct.reviewedAt)
        : '',
      createdBy: newProduct.createdBy || '',
    };
  }

  async updateProduct(id, title, category, currentUser, transaction) {
    const foundProduct = await Product.findByPk(id);
    if (!foundProduct) throw notFound('Товар не знайдено');
    const isProductOwner = currentUser.id.toString() === foundProduct.createdBy;
    const canManageProducts = await checkPermission(
      currentUser,
      'MANAGE_PRODUCTS'
    );
    if (!isProductOwner && !canManageProducts) {
      throw forbidden('Ви не маєте дозволу на редагування цього товару');
    }
    const currentTitle = foundProduct.title;
    if (title !== currentTitle) {
      const duplicateProduct = await Product.findOne({ where: { title } });
      if (duplicateProduct) throw badRequest('Цей товар вже існує');
    } else {
      title = currentTitle;
    }
    const updateData = { title };
    let categoryRecord = null;
    if (category !== undefined) {
      categoryRecord = await getRecordByTitle(Category, category);
      if (category && !categoryRecord) throw notFound('Категорія не знайдена');
      updateData.categoryId = categoryRecord?.id || null;
    }
    const currentUserId = currentUser.id.toString();
    updateData.status = canManageProducts ? 'approved' : 'pending';
    updateData.reviewedBy = canManageProducts ? currentUserId : null;
    updateData.reviewedAt = canManageProducts ? new Date() : null;
    const [affectedRows, [updatedProduct]] = await Product.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
    if (affectedRows === 0) throw badRequest('Дані цього товару не оновлено');
    return {
      id: updatedProduct.id,
      title: updatedProduct.title,
      category: categoryRecord?.title || '',
      status: updatedProduct.status,
      reviewedBy: updatedProduct.reviewedBy || '',
      reviewedAt: updatedProduct.reviewedAt
        ? formatDate(updatedProduct.reviewedAt)
        : '',
      createdBy: updatedProduct.createdBy || '',
    };
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
