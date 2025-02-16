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

describe('CategoriesController', () => {
  let categoryUuid = null;

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
      expect(response.body.user).toHaveProperty('photo');
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
      expect(response.body.user).toHaveProperty('photo');
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
      expect(response.body.user).toHaveProperty('photo');
      authData.administrator.uuid = response.body.user.uuid;
      authData.administrator.accessToken = response.body.accessToken;
    });
  });

  describe('GET /api/categories', () => {
    it('should return list of categories (status approved, default pagination)', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of categories (status approved, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/categories')
        .query({ limit: 10, page: 1 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return list of categories (status pending, default pagination)', async () => {
      const response = await request(app)
        .get('/api/categories')
        .query({ status: 'pending' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of categories (status rejected, default pagination)', async () => {
      const response = await request(app)
        .get('/api/categories')
        .query({ status: 'rejected' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/categories');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('POST /api/categories', () => {
    it('should return 201 for current user having permission to create categories (as moderator)', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Нова модераторська категорія',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Нова модераторська категорія');
      expect(response.body.contentType).toBe('Категорія');
      expect(response.body.status).toBe('Затверджено');
      expect(response.body.moderation.moderatorUuid).toBeDefined();
      expect(response.body.moderation.moderatorFullName).toBeDefined();
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 201 for current user having permission to create categories (as user)', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Нова користувацька категорія',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Нова користувацька категорія');
      expect(response.body.contentType).toBe('Категорія');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.moderation.moderatorUuid).toBe('');
      expect(response.body.moderation.moderatorFullName).toBe('');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
      categoryUuid = response.body.uuid;
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Нова модераторська категорія',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Ця категорія вже існує');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to create categories', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Нова категорія',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на додавання категорій'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('GET /api/categories/:categoryUuid', () => {
    it('should get category by id', async () => {
      const response = await request(app)
        .get(`/api/categories/${categoryUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(categoryUuid);
      expect(response.body.title).toBe('Нова користувацька категорія');
      expect(response.body.contentType).toBe('Категорія');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.moderation.moderatorUuid).toBe('');
      expect(response.body.moderation.moderatorFullName).toBe('');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing category', async () => {
      const response = await request(app)
        .get('/api/categories/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Категорію не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(
        `/api/categories/${categoryUuid}`
      );
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('PATCH /api/categories/:categoryUuid', () => {
    it('should return 200 for current user having permission to edit categories (as user)', async () => {
      const response = await request(app)
        .patch(`/api/categories/${categoryUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Оновлена назва категорії',
        });
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(categoryUuid);
      expect(response.body.title).toBe('Оновлена назва категорії');
      expect(response.body.contentType).toBe('Категорія');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.moderation.moderatorUuid).toBe('');
      expect(response.body.moderation.moderatorFullName).toBe('');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 200 for current user having permission to edit categories (as moderator)', async () => {
      const response = await request(app)
        .patch(`/api/categories/${categoryUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва категорії',
        });
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(categoryUuid);
      expect(response.body.title).toBe('Оновлена назва категорії');
      expect(response.body.contentType).toBe('Категорія');
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
        .patch(`/api/categories/${categoryUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Пристрої',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Ця категорія вже існує');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to edit categories', async () => {
      const response = await request(app)
        .patch(`/api/categories/${categoryUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Оновлена назва категорії',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на редагування цієї категорії'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 for non-existing category update', async () => {
      const response = await request(app)
        .patch('/api/categories/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва категорії',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Категорію не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('DELETE /api/categories/:categoryUuid', () => {
    it('should return 403 for current user not having permission to delete categories', async () => {
      const response = await request(app)
        .delete(`/api/categories/${categoryUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на видалення цієї категорії'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for current user having permission to delete categories', async () => {
      const response = await request(app)
        .delete(`/api/categories/${categoryUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing category deletion', async () => {
      const response = await request(app)
        .delete('/api/categories/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Категорію не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });
});
