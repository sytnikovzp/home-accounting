/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');
const { initializeDatabase, closeDatabase } = require('../utils/seedMongo');

beforeAll(initializeDatabase);
afterAll(closeDatabase);

const authData = {
  user: { id: null, accessToken: null },
  moderator: { id: null, accessToken: null },
  admin: { id: null, accessToken: null },
};

describe('ProductController', () => {
  let productId;

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'hanna.shevchenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Ганна Шевченко');
      expect(response.body.user.role).toBe('User');
      authData.user.id = response.body.user.id;
      authData.user.accessToken = response.body.accessToken;
    });

    it('should login an existing moderator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'oleksandra.ivanchuk@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Олександра Іванчук');
      expect(response.body.user.role).toBe('Moderator');
      authData.moderator.id = response.body.user.id;
      authData.moderator.accessToken = response.body.accessToken;
    });

    it('should login an existing administrator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'ivan.petrenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Іван Петренко');
      expect(response.body.user.role).toBe('Administrator');
      authData.admin.id = response.body.user.id;
      authData.admin.accessToken = response.body.accessToken;
    });
  });

  describe('GET /api/products', () => {
    it('should return list of products (status approved, default pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of products (status approved, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return list of products (status pending, default pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ status: 'pending' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of products (status pending, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ status: 'pending' })
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return list of products (status rejected, default pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ status: 'rejected' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of products (status rejected, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ status: 'rejected' })
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/products', () => {
    it('should return 201 for current user having permission to create products (as moderator)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Новий модераторський товар',
          category: 'Пристрої',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Новий модераторський товар');
      expect(response.body.category).toBe('Пристрої');
      expect(response.body.status).toBe('approved');
      expect(response.body.reviewedBy).toBeDefined();
      expect(response.body.reviewedAt).toBeDefined();
      expect(response.body.createdBy).toBeDefined();
    });

    it('should return 201 for current user having permission to create products (as user)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Новий користувацький товар',
          category: 'Електроніка',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Новий користувацький товар');
      expect(response.body.category).toBe('Електроніка');
      expect(response.body.status).toBe('pending');
      expect(response.body.reviewedBy).toBe('');
      expect(response.body.reviewedAt).toBe('');
      expect(response.body.createdBy).toBeDefined();
      productId = response.body.id;
    });

    it('should return 404 if you specify category that don`t exist', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Новий товар',
          category: 'Машини',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Category not found');
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Новий модераторський товар',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Цей товар вже існує');
    });

    it('should return 403 for current user not having permission to create products', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Новий товар',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на створення товарів'
      );
    });
  });

  describe('GET /api/products/:productId', () => {
    it('should get product by id', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', productId);
      expect(response.body.title).toBe('Новий користувацький товар');
      expect(response.body.category).toBe('Електроніка');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.reviewedBy).toBe('');
      expect(response.body.reviewedAt).toBe('');
      expect(response.body.createdBy).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing product', async () => {
      const response = await request(app)
        .get('/api/products/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Товар не знайдено');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/products/${productId}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/products/:productId/moderate', () => {
    it('should return 403 for current user not having permission to moderate products', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}/moderate`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на модерацію товарів'
      );
    });

    it('should return 200 for current user having permission to moderate products', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}/moderate`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Новий користувацький товар');
      expect(response.body.status).toBe('approved');
      expect(response.body.reviewedBy).toBeDefined();
      expect(response.body.reviewedAt).toBeDefined();
      expect(response.body.createdBy).toBeDefined();
    });
  });

  describe('PATCH /api/products/:productId', () => {
    it('should return 200 for current user having permission to edit products (as user)', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Оновлена назва товару',
          category: 'Обчислювальна техніка',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', productId);
      expect(response.body.title).toBe('Оновлена назва товару');
      expect(response.body.category).toBe('Обчислювальна техніка');
      expect(response.body.status).toBe('pending');
      expect(response.body.reviewedBy).toBe('');
      expect(response.body.reviewedAt).toBe('');
      expect(response.body.createdBy).toBeDefined();
    });

    it('should return 200 for current user having permission to edit products (as moderator)', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва товару',
          category: 'Обчислювальна техніка',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', productId);
      expect(response.body.title).toBe('Оновлена назва товару');
      expect(response.body.category).toBe('Обчислювальна техніка');
      expect(response.body.status).toBe('approved');
      expect(response.body.reviewedBy).toBeDefined();
      expect(response.body.reviewedAt).toBeDefined();
      expect(response.body.createdBy).toBeDefined();
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Помідори',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Цей товар вже існує');
    });

    it('should return 403 for current user not having permission to edit products', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Оновлена назва товару',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на редагування цього товару'
      );
    });

    it('should return 404 for non-existing product update', async () => {
      const response = await request(app)
        .patch('/api/products/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва товару',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Товар не знайдено');
    });
  });

  describe('DELETE /api/products/:productId', () => {
    it('should return 403 for current user not having permission to delete products', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на видалення цього товару'
      );
    });

    it('should return 200 for current user having permission to delete products', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing product deletion', async () => {
      const response = await request(app)
        .delete('/api/products/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Товар не знайдено');
    });
  });
});
