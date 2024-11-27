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
    if (foundProducts.length === 0) throw notFound('Products not found');
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
    if (!foundProduct) throw notFound('Product not found');
    const productData = foundProduct.toJSON();
    return {
      id: productData.id,
      title: productData.title,
      category: productData.Category?.title || '',
      status: productData.status,
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
      throw forbidden('You don`t have permission to moderate products');
    }
    const foundProduct = await Product.findByPk(id);
    if (!foundProduct) throw notFound('Product not found');
    if (!['approved', 'rejected'].includes(status)) {
      throw notFound('Status not found');
    }
    const currentUserId = currentUser.id.toString();
    const updateData = { status };
    updateData.reviewedBy = currentUserId;
    updateData.reviewedAt = new Date();
    const [affectedRows, [moderatedProduct]] = await Product.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (affectedRows === 0) throw badRequest('Product is not moderated');
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
      throw forbidden('You don`t have permission to create products');
    }
    const duplicateProduct = await Product.findOne({ where: { title } });
    if (duplicateProduct) throw badRequest('This product already exists');
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
    if (!newProduct) throw badRequest('Product is not created');
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
    if (!foundProduct) throw notFound('Product not found');
    const isProductOwner = currentUser.id.toString() === foundProduct.createdBy;
    const canManageProducts = await checkPermission(
      currentUser,
      'MANAGE_PRODUCTS'
    );
    if (!isProductOwner && !canManageProducts) {
      throw forbidden('You don`t have permission to edit this product');
    }
    const currentTitle = foundProduct.title;
    if (title !== currentTitle) {
      const duplicateProduct = await Product.findOne({ where: { title } });
      if (duplicateProduct) throw badRequest('This product already exists');
    } else {
      title = currentTitle;
    }
    const updateData = { title };
    let categoryRecord = null;
    if (category !== undefined) {
      categoryRecord = await getRecordByTitle(Category, category);
      if (category && !categoryRecord) throw notFound('Category not found');
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
    if (affectedRows === 0) throw badRequest('Product is not updated');
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
      throw forbidden('You don`t have permission to delete this product');
    const foundProduct = await Product.findByPk(productId);
    if (!foundProduct) throw notFound('Product not found');
    const deletedProduct = await Product.destroy({
      where: { id: productId },
      transaction,
    });
    if (!deletedProduct) throw badRequest('Product is not deleted');
    return deletedProduct;
  }
}

module.exports = new ProductService();
