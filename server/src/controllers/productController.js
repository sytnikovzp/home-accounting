const { Product, sequelize } = require('../db/dbPostgres/models');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../services/productService');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const allProducts = await getAllProducts(limit, offset);
      const productsCount = await Product.count();
      res.status(200).set('X-Total-Count', productsCount).json(allProducts);
    } catch (error) {
      console.error('Get all products error: ', error.message);
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await getProductById(productId);
      res.status(200).json(product);
    } catch (error) {
      console.error('Get product by id error: ', error.message);
      next(error);
    }
  }

  async createProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, description, category } = req.body;
      const newProduct = await createProduct(
        title,
        description,
        category,
        transaction
      );
      await transaction.commit();
      res.status(201).json(newProduct);
    } catch (error) {
      await transaction.rollback();
      console.error('Create product error: ', error.message);
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { productId } = req.params;
      const { title, description, category } = req.body;
      const updatedProduct = await updateProduct(
        productId,
        title,
        description,
        category,
        transaction
      );
      await transaction.commit();
      res.status(200).json(updatedProduct);
    } catch (error) {
      await transaction.rollback();
      console.error('Update product error: ', error.message);
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { productId } = req.params;
      await deleteProduct(productId, transaction);
      await transaction.commit();
      res.sendStatus(res.statusCode);
    } catch (error) {
      await transaction.rollback();
      console.error('Delete product error: ', error.message);
      next(error);
    }
  }
}

module.exports = new ProductController();
