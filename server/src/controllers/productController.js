const { notFound, badRequest } = require('../errors/customErrors');
const { Product, Category, sequelize } = require('../db/dbPostgres/models');
const { formatDate } = require('../utils/sharedFunctions');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
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
      const productsCount = await Product.count();
      const formattedProducts = allProducts.map((product) => {
        return {
          id: product.id,
          title: product.title,
          category: product['Category.title'] || '',
        };
      });
      if (allProducts.length > 0) {
        res
          .status(200)
          .set('X-Total-Count', productsCount)
          .json(formattedProducts);
      } else {
        throw notFound('Products not found');
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { productId } = req.params;
      const productById = await Product.findByPk(productId, {
        attributes: {
          exclude: ['categoryId', 'category_id'],
        },
        include: [
          {
            model: Category,
            attributes: ['title'],
          },
        ],
      });
      if (productById) {
        const productData = productById.toJSON();
        const formattedProduct = {
          ...productData,
          description: productData.description || '',
          category: productData.Category?.title || '',
          createdAt: formatDate(productData.createdAt),
          updatedAt: formatDate(productData.updatedAt),
        };
        delete formattedProduct.Category;
        res.status(200).json(formattedProduct);
      } else {
        throw notFound('Product not found');
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async createProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const {
        title,
        description: descriptionValue,
        category: categoryValue,
      } = req.body;
      const description = descriptionValue === '' ? null : descriptionValue;
      const categoryRecord = categoryValue
        ? await Category.findOne({
            where: { title: categoryValue },
            attributes: ['id', 'title'],
            raw: true,
          })
        : null;
      if (categoryValue && !categoryRecord) {
        throw notFound('Category not found');
      }
      const newBody = {
        title,
        description,
        categoryId: categoryRecord ? categoryRecord.id : null,
      };
      const newProduct = await Product.create(newBody, {
        transaction: t,
        returning: true,
      });
      if (newProduct) {
        const productData = newProduct.toJSON();
        const formattedNewProduct = {
          id: productData.id,
          title: productData.title,
          description: productData.description || '',
          category: categoryRecord ? categoryRecord.title : '',
        };
        await t.commit();
        res.status(201).json(formattedNewProduct);
      } else {
        await t.rollback();
        throw badRequest('Product is not created');
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const {
        id,
        title,
        description: descriptionValue,
        category: categoryValue,
      } = req.body;
      const description = descriptionValue === '' ? null : descriptionValue;
      const categoryRecord = categoryValue
        ? await Category.findOne({
            where: { title: categoryValue },
            attributes: ['id', 'title'],
            raw: true,
          })
        : null;
      if (categoryValue && !categoryRecord) {
        throw notFound('Category not found');
      }
      const newBody = {
        title,
        description,
        categoryId: categoryRecord ? categoryRecord.id : null,
      };
      const [affectedRows, [updatedProduct]] = await Product.update(newBody, {
        where: { id },
        returning: true,
        transaction: t,
      });
      if (affectedRows > 0) {
        const productData = updatedProduct.toJSON();
        const formattedUpdProduct = {
          id: productData.id,
          title: productData.title,
          description: productData.description || '',
          category: categoryRecord ? categoryRecord.title : '',
        };
        await t.commit();
        res.status(200).json(formattedUpdProduct);
      } else {
        await t.rollback();
        throw badRequest('Product is not updated');
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { productId } = req.params;
      const deleteProduct = await Product.destroy({
        where: {
          id: productId,
        },
        transaction: t,
      });
      if (deleteProduct) {
        await t.commit();
        res.sendStatus(res.statusCode);
      } else {
        await t.rollback();
        throw badRequest('Product is not deleted');
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }
}

module.exports = new ProductController();
