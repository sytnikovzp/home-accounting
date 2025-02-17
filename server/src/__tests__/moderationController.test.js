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

describe('ModerationController', () => {
  let categoryUuid = null;
  let productUuid = null;
  let establishmentUuid = null;

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'a.shevchenko@gmail.com',
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
        email: 'i.petrenko@gmail.com',
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

  describe('POST /api/categories', () => {
    it('should return 201 for current user having permission to create categories (as user)', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Тестова категорія',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Тестова категорія');
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
  });

  describe('POST /api/products', () => {
    it('should return 201 for current user having permission to create products (as user)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Тестовий товар',
          category: 'Електроніка',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Тестовий товар');
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
  });

  describe('POST /api/establishments', () => {
    it('should return 201 for current user having permission to create establishments (as user)', async () => {
      const response = await request(app)
        .post('/api/establishments')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Тестовий заклад',
          description: 'Тестовий опис закладу',
          url: 'https://www.tests.com',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Тестовий заклад');
      expect(response.body.description).toBe('Тестовий опис закладу');
      expect(response.body.url).toBe('https://www.tests.com');
      expect(response.body.contentType).toBe('Заклад');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.moderation.moderatorUuid).toBe('');
      expect(response.body.moderation.moderatorFullName).toBe('');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
      establishmentUuid = response.body.uuid;
    });
  });

  describe('GET /api/moderation', () => {
    it('should return list of moderation (default pagination)', async () => {
      const response = await request(app)
        .get('/api/moderation')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of moderation (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/moderation')
        .query({ limit: 10, page: 1 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/moderation');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('PATCH /api/moderation/categories/:categoryUuid', () => {
    it('should return 403 for current user not having permission to moderation categories', async () => {
      const response = await request(app)
        .patch(`/api/moderation/categories/${categoryUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на модерацію категорій'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for current user having permission to moderation categories', async () => {
      const response = await request(app)
        .patch(`/api/moderation/categories/${categoryUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(categoryUuid);
      expect(response.body.title).toBe('Тестова категорія');
      expect(response.body.status).toBe('Затверджено');
      expect(response.body.moderation.moderatorUuid).toBeDefined();
      expect(response.body.moderation.moderatorFullName).toBeDefined();
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });
  });

  describe('PATCH /api/moderation/products/:productUuid', () => {
    it('should return 403 for current user not having permission to moderation products', async () => {
      const response = await request(app)
        .patch(`/api/moderation/products/${productUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на модерацію товарів'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for current user having permission to moderation products', async () => {
      const response = await request(app)
        .patch(`/api/moderation/products/${productUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(productUuid);
      expect(response.body.title).toBe('Тестовий товар');
      expect(response.body.status).toBe('Затверджено');
      expect(response.body.moderation.moderatorUuid).toBeDefined();
      expect(response.body.moderation.moderatorFullName).toBeDefined();
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });
  });

  describe('PATCH /api/moderation/establishments/:establishmentUuid', () => {
    it('should return 403 for current user not having permission to moderation establishments', async () => {
      const response = await request(app)
        .patch(`/api/moderation/establishments/${establishmentUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на модерацію закладів'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for current user having permission to moderation establishments', async () => {
      const response = await request(app)
        .patch(`/api/moderation/establishments/${establishmentUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(establishmentUuid);
      expect(response.body.title).toBe('Тестовий заклад');
      expect(response.body.status).toBe('Затверджено');
      expect(response.body.moderation.moderatorUuid).toBeDefined();
      expect(response.body.moderation.moderatorFullName).toBeDefined();
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });
  });
});
