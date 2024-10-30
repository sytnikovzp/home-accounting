const { Product, Category } = require('../db/dbPostgres/models');
const { notFound, badRequest } = require('../errors/customErrors');
const { formatDate } = require('../utils/sharedFunctions');

class ProductService {
  async getAllProducts(limit, offset) {
    const allProducts = await Product.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: Category,
          attributes: ['title'],
        },
      ],
      raw: true,
      limit,
      offset,
    });
    if (allProducts.length === 0) throw notFound('Products not found');
    const formattedProducts = allProducts.map((product) => ({
      id: product.id,
      title: product.title,
      category: product['Category.title'] || '',
    }));
    return formattedProducts;
  }

  async getProductById(productId) {
    const productById = await Product.findByPk(productId, {
      attributes: { exclude: ['categoryId', 'category_id'] },
      include: [{ model: Category, attributes: ['title'] }],
    });
    if (!productById) throw notFound('Product not found');
    const productData = productById.toJSON();
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
    const existingProduct = await Product.findOne({ where: { title } });
    if (existingProduct) throw badRequest('This product already exists');
    const description = descriptionValue === '' ? null : descriptionValue;
    const categoryRecord = category
      ? await Category.findOne({
          where: { title: category },
          attributes: ['id', 'title'],
          raw: true,
        })
      : null;
    if (category && !categoryRecord) throw notFound('Category not found');
    const newProduct = await Product.create(
      { title, description, categoryId: categoryRecord?.id || null },
      { transaction, returning: true }
    );
    if (!newProduct) throw badRequest('Product is not created');
    return {
      id: newProduct.id,
      title: newProduct.title,
      description: newProduct.description || '',
      category: categoryRecord ? categoryRecord.title : '',
    };
  }

  async updateProduct(id, title, descriptionValue, category, transaction) {
    const productById = await Product.findByPk(id);
    if (!productById) throw notFound('Product not found');
    const currentTitle = productById.title;
    if (title !== currentTitle) {
      const existingProduct = await Product.findOne({ where: { title } });
      if (existingProduct) throw badRequest('This product already exists');
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
      categoryRecord = category
        ? await Category.findOne({
            where: { title: category },
            attributes: ['id', 'title'],
            raw: true,
          })
        : null;
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
      category: categoryRecord ? categoryRecord.title : '',
    };
  }

  async deleteProduct(productId, transaction) {
    const productById = await Product.findByPk(productId);
    if (!productById) throw notFound('Product not found');
    const deletedProduct = await Product.destroy({
      where: { id: productId },
      transaction,
    });
    if (!deletedProduct) throw badRequest('Product is not deleted');
    return deletedProduct;
  }
}

module.exports = new ProductService();