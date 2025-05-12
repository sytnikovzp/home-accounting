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
      const {
        pagination: { limit, offset },
        query: { status = 'approved', sort = 'uuid', order = 'asc' },
      } = req;
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
      const {
        params: { productUuid },
      } = req;
      const productByUuid = await getProductByUuid(productUuid);
      if (productByUuid) {
        res.status(200).json(productByUuid);
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
      const {
        body: { title, category },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        params: { productUuid },
        body: { title, category },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        params: { productUuid },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
