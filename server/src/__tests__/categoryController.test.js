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

describe('CategoryController', () => {
  let categoryId;

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
        .query({ page: 1, limit: 10 })
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

    it('should return list of categories (status pending, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/categories')
        .query({ status: 'pending' })
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
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

    it('should return list of categories (status rejected, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/categories')
        .query({ status: 'rejected' })
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/categories');
      expect(response.status).toBe(401);
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
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Нова модераторська категорія');
      expect(response.body.status).toBe('Затверджено');
      expect(response.body.moderatorId).toBeDefined();
      expect(response.body.creatorId).toBeDefined();
    });

    it('should return 201 for current user having permission to create categories (as user)', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Нова користувацька категорія',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Нова користувацька категорія');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.moderatorId).toBe('');

      expect(response.body.creatorId).toBeDefined();
      categoryId = response.body.id;
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Нова модераторська категорія',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Ця категорія вже існує');
    });

    it('should return 403 for current user not having permission to create categories', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Нова категорія',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на створення категорій'
      );
    });
  });

  describe('GET /api/categories/:categoryId', () => {
    it('should get category by id', async () => {
      const response = await request(app)
        .get(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', categoryId);
      expect(response.body.title).toBe('Нова користувацька категорія');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.moderatorId).toBe('');

      expect(response.body.creatorId).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing category', async () => {
      const response = await request(app)
        .get('/api/categories/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Категорія не знайдена');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/categories/${categoryId}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/categories/moderate/:categoryId', () => {
    it('should return 403 for current user not having permission to moderate categories', async () => {
      const response = await request(app)
        .patch(`/api/categories/moderate/${categoryId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на модерацію категорій'
      );
    });

    it('should return 200 for current user having permission to moderate categories', async () => {
      const response = await request(app)
        .patch(`/api/categories/moderate/${categoryId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Нова користувацька категорія');
      expect(response.body.status).toBe('approved');
      expect(response.body.moderatorId).toBeDefined();

      expect(response.body.creatorId).toBeDefined();
    });
  });

  describe('PATCH /api/categories/:categoryId', () => {
    it('should return 200 for current user having permission to edit categories (as user)', async () => {
      const response = await request(app)
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Оновлена назва категорії',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', categoryId);
      expect(response.body.title).toBe('Оновлена назва категорії');
      expect(response.body.status).toBe('pending');
      expect(response.body.moderatorId).toBe('');

      expect(response.body.creatorId).toBeDefined();
    });

    it('should return 200 for current user having permission to edit categories (as moderator)', async () => {
      const response = await request(app)
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва категорії',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', categoryId);
      expect(response.body.title).toBe('Оновлена назва категорії');
      expect(response.body.status).toBe('approved');
      expect(response.body.moderatorId).toBeDefined();

      expect(response.body.creatorId).toBeDefined();
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Пристрої',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Ця категорія вже існує');
    });

    it('should return 403 for current user not having permission to edit categories', async () => {
      const response = await request(app)
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Оновлена назва категорії',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на редагування цієї категорії'
      );
    });

    it('should return 404 for non-existing category update', async () => {
      const response = await request(app)
        .patch('/api/categories/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва категорії',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Категорія не знайдена');
    });
  });

  describe('DELETE /api/categories/:categoryId', () => {
    it('should return 403 for current user not having permission to delete categories', async () => {
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на видалення цієї категорії'
      );
    });

    it('should return 200 for current user having permission to delete categories', async () => {
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing category deletion', async () => {
      const response = await request(app)
        .delete('/api/categories/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Категорія не знайдена');
    });
  });
});
