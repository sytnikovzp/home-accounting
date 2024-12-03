/* eslint-disable no-undef */
const path = require('path');
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

describe('ShopController', () => {
  let shopId;

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
        email: 'o.ivanchuk@gmail.com',
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

  describe('GET /api/shops', () => {
    it('should return list of shops (status approved, default pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of shops (status approved, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return list of shops (status pending, default pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .query({ status: 'pending' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of shops (status pending, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .query({ status: 'pending' })
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return list of shops (status rejected, default pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .query({ status: 'rejected' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of shops (status rejected, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .query({ status: 'rejected' })
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/shops');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/shops', () => {
    it('should return 201 for current user having permission to create shops (as moderator)', async () => {
      const response = await request(app)
        .post('/api/shops')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Новий модераторський магазин',
          description: 'Тестовий опис магазину',
          url: 'https://www.moderator.com',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Новий модераторський магазин');
      expect(response.body.description).toBe('Тестовий опис магазину');
      expect(response.body.url).toBe('https://www.moderator.com');
      expect(response.body.status).toBe('approved');
      expect(response.body.moderatorId).toBeDefined();

      expect(response.body.creatorId).toBeDefined();
    });

    it('should return 201 for current user having permission to create shops (as user)', async () => {
      const response = await request(app)
        .post('/api/shops')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Новий користувацький магазин',
          description: 'Тестовий опис магазину',
          url: 'https://www.user.com',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Новий користувацький магазин');
      expect(response.body.description).toBe('Тестовий опис магазину');
      expect(response.body.url).toBe('https://www.user.com');
      expect(response.body.status).toBe('pending');
      expect(response.body.moderatorId).toBe('');

      expect(response.body.creatorId).toBeDefined();
      shopId = response.body.id;
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/shops')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Новий модераторський магазин',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Цей магазин вже існує');
    });

    it('should return 403 for current user not having permission to create shops', async () => {
      const response = await request(app)
        .post('/api/shops')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Новий магазин',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на створення магазинів'
      );
    });
  });

  describe('GET /api/shops/:shopId', () => {
    it('should get shop by id', async () => {
      const response = await request(app)
        .get(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', shopId);
      expect(response.body.title).toBe('Новий користувацький магазин');
      expect(response.body.description).toBe('Тестовий опис магазину');
      expect(response.body.url).toBe('https://www.user.com');
      expect(response.body).toHaveProperty('logo');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.moderatorId).toBe('');

      expect(response.body.creatorId).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing shop', async () => {
      const response = await request(app)
        .get('/api/shops/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Магазин не знайдено');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/shops/${shopId}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/shops/moderate/:shopId', () => {
    it('should return 403 for current user not having permission to moderate shops', async () => {
      const response = await request(app)
        .patch(`/api/shops/moderate/${shopId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на модерацію магазинів'
      );
    });

    it('should return 200 for current user having permission to moderate shops', async () => {
      const response = await request(app)
        .patch(`/api/shops/moderate/${shopId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Новий користувацький магазин');
      expect(response.body.status).toBe('approved');
      expect(response.body.moderatorId).toBeDefined();

      expect(response.body.creatorId).toBeDefined();
    });
  });

  describe('PATCH /api/shops/:shopId', () => {
    it('should return 200 for current user having permission to edit shops (as user)', async () => {
      const response = await request(app)
        .patch(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Оновлена назва магазину',
          description: 'Оновлений опис магазину',
          url: 'https://www.updated.com',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', shopId);
      expect(response.body.title).toBe('Оновлена назва магазину');
      expect(response.body.description).toBe('Оновлений опис магазину');
      expect(response.body.url).toBe('https://www.updated.com');
      expect(response.body.status).toBe('pending');
      expect(response.body.moderatorId).toBe('');

      expect(response.body.creatorId).toBeDefined();
    });

    it('should return 200 for current user having permission to edit shops (as moderator)', async () => {
      const response = await request(app)
        .patch(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва магазину',
          description: 'Оновлений опис магазину',
          url: 'https://www.updated.com',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', shopId);
      expect(response.body.title).toBe('Оновлена назва магазину');
      expect(response.body.description).toBe('Оновлений опис магазину');
      expect(response.body.url).toBe('https://www.updated.com');
      expect(response.body.status).toBe('approved');
      expect(response.body.moderatorId).toBeDefined();

      expect(response.body.creatorId).toBeDefined();
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Varus',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Цей магазин вже існує');
    });

    it('should return 403 for current user not having permission to edit shops', async () => {
      const response = await request(app)
        .patch(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Оновлена назва магазину',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на редагування цього магазину'
      );
    });

    it('should return 404 for non-existing shop update', async () => {
      const response = await request(app)
        .patch('/api/shops/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва магазину',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Магазин не знайдено');
    });
  });

  describe('PATCH /api/shops/logo/:shopId', () => {
    it('should update shop logo', async () => {
      const response = await request(app)
        .patch(`/api/shops/logo/${shopId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .attach('shopLogo', path.resolve('/Users/nadia/Downloads/atb.png'));
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', shopId);
      expect(response.body).toHaveProperty('logo');
      expect(response.body.logo).toBeDefined();
      expect(response.body.status).toBe('pending');
      expect(response.body.moderatorId).toBe('');

      expect(response.body.creatorId).toBeDefined();
    });
  });

  describe('PATCH /api/shops/delete-logo/:shopId', () => {
    it('should remove shop logo', async () => {
      const updatedShop = {
        logo: null,
      };
      const response = await request(app)
        .patch(`/api/shops/delete-logo/${shopId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send(updatedShop);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', shopId);
      expect(response.body).toHaveProperty('logo');
      expect(response.body.logo).toBe('');
      expect(response.body.status).toBe('pending');
      expect(response.body.moderatorId).toBe('');

      expect(response.body.creatorId).toBeDefined();
    });
  });

  describe('DELETE /api/shops/:shopId', () => {
    it('should return 403 for current user not having permission to delete shops', async () => {
      const response = await request(app)
        .delete(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на видалення цього магазину'
      );
    });

    it('should return 200 for current user having permission to delete shops', async () => {
      const response = await request(app)
        .delete(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing shop deletion', async () => {
      const response = await request(app)
        .delete('/api/shops/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Магазин не знайдено');
    });
  });
});
