const { sequelize } = require('../db/dbPostgres/models');

const {
  getAllProducts,
  getProductByUuid,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../services/productsService');
const { getCurrentUser } = require('../services/usersService');

class ProductsController {
  static async getAllProducts(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { status = 'approved', sort = 'uuid', order = 'asc' } = req.query;
      const { allProducts, totalCount } = await getAllProducts(
        status,
        limit,
        offset,
        sort,
        order
      );
      if (allProducts.length > 0) {
        res.status(200).set('X-Total-Count', totalCount).json(allProducts);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get all products error: ', error.message);
      next(error);
    }
  }

  static async getProductByUuid(req, res, next) {
    try {
      const { productUuid } = req.params;
      const product = await getProductByUuid(productUuid);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get product by UUID error: ', error.message);
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, category } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const newProduct = await createProduct(
        title,
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

  static async updateProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { productUuid } = req.params;
      const { title, category } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedProduct = await updateProduct(
        productUuid,
        title,
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

  static async deleteProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { productUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.uuid);
      const deletedProduct = await deleteProduct(
        productUuid,
        currentUser,
        transaction
      );
      if (deletedProduct) {
        await transaction.commit();
        res.status(200).json('OK');
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

module.exports = ProductsController;
