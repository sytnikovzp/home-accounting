const { Product, Category } = require('../db/dbPostgres/models');
const { notFound, badRequest } = require('../errors/customErrors');
const { formatDate, getRecordByTitle } = require('../utils/sharedFunctions');

class ProductService {
  async getAllProducts(limit, offset) {
    const foundProducts = await Product.findAll({
      attributes: ['id', 'title'],
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
    const total = await Product.count();
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
      description: productData.description || '',
      category: productData.Category?.title || '',
      createdAt: formatDate(productData.createdAt),
      updatedAt: formatDate(productData.updatedAt),
    };
  }

  async createProduct(title, descriptionValue, category, transaction) {
    const duplicateProduct = await Product.findOne({ where: { title } });
    if (duplicateProduct) throw badRequest('This product already exists');
    const description = descriptionValue === '' ? null : descriptionValue;
    let categoryRecord = null;
    if (category !== undefined) {
      categoryRecord = await getRecordByTitle(Category, category);
    }
    const newProductData = {
      title,
      description,
      categoryId: categoryRecord?.id || null,
    };
    const newProduct = await Product.create(newProductData, {
      transaction,
      returning: true,
    });
    if (!newProduct) throw badRequest('Product is not created');
    return {
      id: newProduct.id,
      title: newProduct.title,
      description: newProduct.description || '',
      category: categoryRecord?.title || '',
    };
  }

  async updateProduct(id, title, descriptionValue, category, transaction) {
    const foundProduct = await Product.findByPk(id);
    if (!foundProduct) throw notFound('Product not found');
    const currentTitle = foundProduct.title;
    if (title !== currentTitle) {
      const duplicateProduct = await Product.findOne({ where: { title } });
      if (duplicateProduct) throw badRequest('This product already exists');
    } else {
      title = currentTitle;
    }
    const updateData = { title };
    if (descriptionValue !== undefined) {
      const description = descriptionValue === '' ? null : descriptionValue;
      updateData.description = description;
    }
    let categoryRecord = null;
    if (category !== undefined) {
      categoryRecord = await getRecordByTitle(Category, category);
      if (category && !categoryRecord) throw notFound('Category not found');
      updateData.categoryId = categoryRecord?.id || null;
    }
    const [affectedRows, [updatedProduct]] = await Product.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
    if (affectedRows === 0) throw badRequest('Product is not updated');
    return {
      id: updatedProduct.id,
      title: updatedProduct.title,
      description: updatedProduct.description || '',
      category: categoryRecord?.title || '',
    };
  }

  async deleteProduct(productId, transaction) {
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
