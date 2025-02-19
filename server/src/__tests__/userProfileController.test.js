/* eslint-disable no-undef */
const path = require('path');

const request = require('supertest');

const app = require('../app');
const { connectMongoDB, closeMongoDB } = require('../db/dbMongo');

beforeAll(connectMongoDB);
afterAll(closeMongoDB);

const authData = {
  user: { accessToken: null, uuid: null },
};

describe('UserController', () => {
  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'm.scherbak@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Микола Щербак');
      expect(response.body.user.role).toBe('Users');
      expect(response.body.user).toHaveProperty('photo');
      authData.user.uuid = response.body.user.uuid;
      authData.user.accessToken = response.body.accessToken;
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

  describe('GET /api/profile', () => {
    it('should get user profile data by access token', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(authData.user.uuid);
      expect(response.body.fullName).toBe('Микола Щербак');
      expect(response.body.role.title).toBe('Users');
      expect(response.body).toHaveProperty('photo');
      expect(response.body.email).toBe('m.scherbak@gmail.com');
      expect(response.body.emailConfirm).toBe('Підтверджений');
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
      expect(response.body).toHaveProperty('permissions');
      expect(Array.isArray(response.body.permissions)).toBe(true);
      expect(response.body.permissions[0]).toHaveProperty('uuid');
      expect(response.body.permissions[0]).toHaveProperty('title');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/users/profile');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('PATCH /api/profile', () => {
    it('should update myself user data', async () => {
      const response = await request(app)
        .patch(`/api/profile`)
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
        .patch(`/api/profile`)
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

    it('should return 403 for current user not having permission to change user roles', async () => {
      const response = await request(app)
        .patch(`/api/profile`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          fullName: 'Updated User',
          role: 'Moderators',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'У Вас немає дозволу на редагування ролі цього користувача'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).patch(`/api/profile`).send({
        fullName: 'Updated User',
        role: 'Users',
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('PATCH /api/profile/photo', () => {
    it('should be change user photo', async () => {
      const response = await request(app)
        .patch(`/api/profile/photo`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .attach('userPhoto', path.resolve('/Users/nadia/Downloads/user.png'));
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(authData.user.uuid);
      expect(response.body).toHaveProperty('photo');
      expect(response.body.photo).toBeDefined();
    });
  });

  describe('DELETE /api/profile/photo', () => {
    it('should be reset user photo', async () => {
      const response = await request(app)
        .delete(`/api/profile/photo`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(authData.user.uuid);
      expect(response.body).toHaveProperty('photo');
      expect(response.body.photo).toBe('');
    });
  });

  describe('PATCH /api/profile/password', () => {
    it('should change user password', async () => {
      const response = await request(app)
        .patch(`/api/profile/password`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          newPassword: 'Qwerty1234567',
          confirmNewPassword: 'Qwerty1234567',
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

    it('should return 400 for incorrect current password', async () => {
      const response = await request(app)
        .patch(`/api/profile/password`)
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

  describe('DELETE /api/profile', () => {
    it('should return 200 for current user having permission to delete myself user', async () => {
      const response = await request(app)
        .delete(`/api/profile`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
    });
  });
});
