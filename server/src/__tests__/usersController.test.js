/* eslint-disable no-undef */
const path = require('path');

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

describe('UserController', () => {
  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'e.kovalenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Євген Коваленко');
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

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'WrongUser@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('GET /api/users', () => {
    it('should get all users (default pagination)', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should get all users (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/users')
        .query({ limit: 10, page: 1 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should get all confirmed users (default pagination)', async () => {
      const response = await request(app)
        .get('/api/users')
        .query({ emailConfirm: 'confirmed' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('GET /api/users/:userUuid', () => {
    it('should get user by id', async () => {
      const response = await request(app)
        .get(`/api/users/${authData.user.uuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(authData.user.uuid);
      expect(response.body.fullName).toBe('Євген Коваленко');
      expect(response.body.role.title).toBe('Users');
      expect(response.body).toHaveProperty('photo');
      expect(response.body.email).toBe('e.kovalenko@gmail.com');
      expect(response.body.emailConfirm).toBe('Підтверджений');
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
      expect(response.body).toHaveProperty('permissions');
      expect(Array.isArray(response.body.permissions)).toBe(true);
      expect(response.body.permissions[0]).toHaveProperty('uuid');
      expect(response.body.permissions[0]).toHaveProperty('title');
    });

    it('should return 404 for non-existing user', async () => {
      const response = await request(app)
        .get('/api/users/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Користувача не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(
        `/api/users/${authData.user.uuid}`
      );
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('PATCH /api/users/:userUuid', () => {
    it('should update myself user data', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.uuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          fullName: 'Updated User',
        });
      expect(response.status).toBe(200);
      expect(response.body.user.uuid).toBe(authData.user.uuid);
      expect(response.body.user.fullName).toBe('Updated User');
      expect(response.body.user.emailConfirm).toBe('Підтверджений');
      expect(response.body.user.role).toBe('Users');
      expect(response.body.user).toHaveProperty('photo');
      expect(response.body).toHaveProperty('permissions');
      expect(Array.isArray(response.body.permissions)).toBe(true);
      if (response.body.accessToken !== authData.user.accessToken) {
        authData.user.accessToken = response.body.accessToken;
      }
    });

    it('should return 400 if an element with that email already exists', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.uuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          fullName: 'Updated User',
          email: 'o.ivanchuk@gmail.com',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'Ця електронна адреса вже використовується'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should update other user data', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.moderator.uuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          fullName: 'Updated User',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на оновлення даних цього користувача'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to change user roles', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.uuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          fullName: 'Updated User',
          role: 'Moderators',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на редагування ролі цього користувача'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.uuid}`)
        .send({
          fullName: 'Updated User',
        });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });

    it('should return 404 for non-existing user update', async () => {
      const response = await request(app)
        .patch('/api/users/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          fullName: 'Невірний користувач',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Користувача не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for user having permission to change user roles', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.uuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          fullName: 'Updated User',
          email: 'sytnikov.zp@Gmail.com',
          role: 'Moderators',
        });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Updated User');
      expect(response.body.user.role).toBe('Moderators');
      if (response.body.accessToken !== authData.user.accessToken) {
        authData.user.accessToken = response.body.accessToken;
      }
    });
  });

  describe('PATCH /api/users/:userUuid/photo', () => {
    it('should be change user photo', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.uuid}/photo`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .attach('userPhoto', path.resolve('/Users/nadia/Downloads/user.png'));
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(authData.user.uuid);
      expect(response.body).toHaveProperty('photo');
      expect(response.body.photo).toBeDefined();
    });
  });

  describe('DELETE /api/users/:userUuid/photo', () => {
    it('should be reset user photo', async () => {
      const response = await request(app)
        .delete(`/api/users/${authData.user.uuid}/photo`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(authData.user.uuid);
      expect(response.body).toHaveProperty('photo');
      expect(response.body.photo).toBe('');
    });
  });

  describe('PATCH /api/users/:userUuid/password', () => {
    it('should change user password', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.uuid}/password`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          newPassword: 'Qwerty1234567',
          confirmNewPassword: 'Qwerty1234567',
        });
      expect(response.status).toBe(200);
      expect(response.body.user.uuid).toBe(authData.user.uuid);
      expect(response.body.user.fullName).toBe('Updated User');
      expect(response.body.user.emailConfirm).toBe('Очікує підтвердження');
      expect(response.body.user.role).toBe('Moderators');
      expect(response.body.user).toHaveProperty('photo');
      expect(response.body).toHaveProperty('permissions');
      expect(Array.isArray(response.body.permissions)).toBe(true);
      if (response.body.accessToken !== authData.user.accessToken) {
        authData.user.accessToken = response.body.accessToken;
      }
    });

    it('should return 400 for incorrect current password', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.uuid}/password`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          newPassword: 'Qwerty12345',
          confirmNewPassword: 'Qwerty1234567',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Паролі повинні співпадати');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка валідації');
    });
  });

  describe('DELETE /api/users/:userUuid', () => {
    it('should return 403 for current user not having permission to delete user', async () => {
      const response = await request(app)
        .delete(`/api/users/${authData.user.uuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на видалення профілю цього користувача'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for current user having permission to delete myself user', async () => {
      const response = await request(app)
        .delete(`/api/users/${authData.user.uuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing user deletion', async () => {
      const response = await request(app)
        .delete('/api/users/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Користувача не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });
});
