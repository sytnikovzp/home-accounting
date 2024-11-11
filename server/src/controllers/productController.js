const { sequelize } = require('../db/dbPostgres/models');
const { getCurrentUser } = require('../services/userService');
const {
  getAllProducts,
  getProductById,
  updateProductStatus,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../services/productService');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { status = 'approved' } = req.query;
      const { allProducts, total } = await getAllProducts(
        limit,
        offset,
        status
      );
      if (allProducts.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allProducts);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get all products error: ', error.message);
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await getProductById(productId);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get product by id error: ', error.message);
      next(error);
    }
  }

  async reviewProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { productId } = req.params;
      const { status } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedProduct = await updateProductStatus(
        productId,
        status,
        currentUser,
        transaction
      );
      if (updatedProduct) {
        await transaction.commit();
        res.status(200).json(updatedProduct);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.log('Moderate product error: ', error.message);
      next(error);
    }
  }

  async createProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, description, category } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const newProduct = await createProduct(
        title,
        description,
        category,
        currentUser,
        transaction
      );
      if (newProduct) {
        await transaction.commit();
        res.status(201).json(newProduct);
      } else {
        await transaction.rollback();
        res.status(401);
      }
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
      const currentUser = await getCurrentUser(req.user.email);
      const updatedProduct = await updateProduct(
        productId,
        title,
        description,
        category,
        currentUser,
        transaction
      );
      if (updatedProduct) {
        await transaction.commit();
        res.status(200).json(updatedProduct);
      } else {
        await transaction.rollback();
        res.status(401);
      }
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
      const currentUser = await getCurrentUser(req.user.email);
      const deletedProduct = await deleteProduct(
        productId,
        currentUser,
        transaction
      );
      if (deletedProduct) {
        await transaction.commit();
        res.sendStatus(res.statusCode);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Delete product error: ', error.message);
      next(error);
    }
  }
}

module.exports = new ProductController();
