const createError = require('http-errors');
const { format } = require('date-fns');
// ====================================================
const { Product, Category, sequelize } = require('../db/dbPostgres/models');

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
        next(createError(404, 'Products not found'));
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
          createdAt: format(
            new Date(productData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(productData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        delete formattedProduct.Category;

        res.status(200).json(formattedProduct);
      } else {
        next(createError(404, 'Product not found'));
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
      const category = categoryValue === '' ? null : categoryValue;

      const categoryRecord = category
        ? await Category.findOne({
            where: { title: category },
            attributes: ['id'],
            raw: true,
          })
        : null;

      if (category && !categoryRecord) {
        throw new Error('Category not found');
      }

      const categoryId = categoryRecord ? categoryRecord.id : null;

      const newBody = { title, description, categoryId };

      const newProduct = await Product.create(newBody, {
        transaction: t,
        returning: true,
      });

      if (newProduct) {
        const productData = newProduct.toJSON();

        const formattedNewProduct = {
          ...productData,
          description: productData.description || '',
          categoryId: productData.categoryId || '',
          createdAt: format(
            new Date(productData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(productData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        await t.commit();
        res.status(201).json(formattedNewProduct);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
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
      const category = categoryValue === '' ? null : categoryValue;

      const categoryRecord = category
        ? await Category.findOne({
            where: { title: category },
            attributes: ['id'],
            raw: true,
          })
        : null;

      if (category && !categoryRecord) {
        throw new Error('Category not found');
      }

      const categoryId = categoryRecord ? categoryRecord.id : null;

      const newBody = { title, description, categoryId };

      const [affectedRows, [updatedProduct]] = await Product.update(newBody, {
        where: { id },
        returning: true,
        transaction: t,
      });

      if (affectedRows > 0) {
        const productData = updatedProduct.toJSON();

        const formattedUpdProduct = {
          ...productData,
          description: productData.description || '',
          categoryId: productData.category_id || '',
          createdAt: format(
            new Date(productData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(productData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        delete formattedUpdProduct.category_id;

        await t.commit();
        res.status(200).json(formattedUpdProduct);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
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
        next(createError(400, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }
}

module.exports = new ProductController();
