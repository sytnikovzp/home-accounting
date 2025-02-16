/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../app');
const { connectMongoDB, closeMongoDB } = require('../db/dbMongo');

beforeAll(connectMongoDB);
afterAll(closeMongoDB);

const authData = {
  administrator: { accessToken: null, uuid: null },
  moderator: { accessToken: null, uuid: null },
  user: { accessToken: null, uuid: null },
};

describe('ProductsController', () => {
  let productUuid = null;

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'hanna.shevchenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Ганна Шевченко');
      expect(response.body.user.role).toBe('Users');
      authData.user.uuid = response.body.user.uuid;
      authData.user.accessToken = response.body.accessToken;
    });

    it('should login an existing moderator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'o.ivanchuk@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Олександра Іванчук');
      expect(response.body.user.role).toBe('Moderators');
      authData.moderator.uuid = response.body.user.uuid;
      authData.moderator.accessToken = response.body.accessToken;
    });

    it('should login an existing administrator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'ivan.petrenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Іван Петренко');
      expect(response.body.user.role).toBe('Administrators');
      authData.administrator.uuid = response.body.user.uuid;
      authData.administrator.accessToken = response.body.accessToken;
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
        .query({ limit: 10, page: 1 })
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

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('POST /api/products', () => {
    it('should return 201 for current user having permission to create products (as moderator)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          category: 'Пристрої',
          title: 'Новий модераторський товар',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Новий модераторський товар');
      expect(response.body.contentType).toBe('Товар');
      expect(response.body.status).toBe('Затверджено');
      expect(response.body.moderation.moderatorUuid).toBeDefined();
      expect(response.body.moderation.moderatorFullName).toBeDefined();
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 201 for current user having permission to create products (as user)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          category: 'Електроніка',
          title: 'Новий користувацький товар',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Новий користувацький товар');
      expect(response.body.contentType).toBe('Товар');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.moderation.moderatorUuid).toBe('');
      expect(response.body.moderation.moderatorFullName).toBe('');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
      productUuid = response.body.uuid;
    });

    it('should return 404 if you specify category that don`t exist', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          category: 'Машини',
          title: 'Новий товар',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Category not found');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Новий модераторський товар',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Цей товар вже існує');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to create products', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Новий товар',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на додавання товарів'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('GET /api/products/:productUuid', () => {
    it('should get product by id', async () => {
      const response = await request(app)
        .get(`/api/products/${productUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(productUuid);
      expect(response.body.title).toBe('Новий користувацький товар');
      expect(response.body.category.title).toBe('Електроніка');
      expect(response.body.contentType).toBe('Товар');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.moderation.moderatorUuid).toBe('');
      expect(response.body.moderation.moderatorFullName).toBe('');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing product', async () => {
      const response = await request(app)
        .get('/api/products/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Товар не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/products/${productUuid}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('PATCH /api/products/:productUuid', () => {
    it('should return 200 for current user having permission to edit products (as user)', async () => {
      const response = await request(app)
        .patch(`/api/products/${productUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          category: 'Обчислювальна техніка',
          title: 'Оновлена назва товару',
        });
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(productUuid);
      expect(response.body.title).toBe('Оновлена назва товару');
      expect(response.body.contentType).toBe('Товар');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.moderation.moderatorUuid).toBe('');
      expect(response.body.moderation.moderatorFullName).toBe('');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 200 for current user having permission to edit products (as moderator)', async () => {
      const response = await request(app)
        .patch(`/api/products/${productUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          category: 'Обчислювальна техніка',
          title: 'Оновлена назва товару',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', productUuid);
      expect(response.body.title).toBe('Оновлена назва товару');
      expect(response.body.contentType).toBe('Товар');
      expect(response.body.status).toBe('Затверджено');
      expect(response.body.moderation.moderatorUuid).toBeDefined();
      expect(response.body.moderation.moderatorFullName).toBeDefined();
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/products/${productUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Помідори',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Цей товар вже існує');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to edit products', async () => {
      const response = await request(app)
        .patch(`/api/products/${productUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Оновлена назва товару',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на редагування цього товару'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 for non-existing product update', async () => {
      const response = await request(app)
        .patch('/api/products/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва товару',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Товар не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('DELETE /api/products/:productUuid', () => {
    it('should return 403 for current user not having permission to delete products', async () => {
      const response = await request(app)
        .delete(`/api/products/${productUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на видалення цього товару'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for current user having permission to delete products', async () => {
      const response = await request(app)
        .delete(`/api/products/${productUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing product deletion', async () => {
      const response = await request(app)
        .delete('/api/products/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Товар не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });
});
