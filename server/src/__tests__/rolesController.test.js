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

describe('RolesController', () => {
  let roleUuid = null;

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'a.shevchenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.authenticatedUser).toHaveProperty('uuid');
      expect(response.body.authenticatedUser.fullName).toBe('Ганна Шевченко');
      expect(response.body.authenticatedUser.role).toBe('Users');
      expect(response.body.authenticatedUser).toHaveProperty('photo');
      authData.user.uuid = response.body.authenticatedUser.uuid;
      authData.user.accessToken = response.body.accessToken;
    });

    it('should login an existing moderator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'o.ivanchuk@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.authenticatedUser).toHaveProperty('uuid');
      expect(response.body.authenticatedUser.fullName).toBe(
        'Олександра Іванчук'
      );
      expect(response.body.authenticatedUser.role).toBe('Moderators');
      expect(response.body.authenticatedUser).toHaveProperty('photo');
      authData.moderator.uuid = response.body.authenticatedUser.uuid;
      authData.moderator.accessToken = response.body.accessToken;
    });

    it('should login an existing administrator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'i.petrenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.authenticatedUser).toHaveProperty('uuid');
      expect(response.body.authenticatedUser.fullName).toBe('Іван Петренко');
      expect(response.body.authenticatedUser.role).toBe('Administrators');
      expect(response.body.authenticatedUser).toHaveProperty('photo');
      authData.administrator.uuid = response.body.authenticatedUser.uuid;
      authData.administrator.accessToken = response.body.accessToken;
    });
  });

  describe('GET /api/roles', () => {
    it('should return list of roles (default pagination)', async () => {
      const response = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
      response.body.forEach((role) => {
        expect(role).toHaveProperty('uuid');
        expect(role).toHaveProperty('title');
      });
    });

    it('should return list of roles (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/roles')
        .query({ limit: 10, page: 1 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
      response.body.forEach((role) => {
        expect(role).toHaveProperty('uuid');
        expect(role).toHaveProperty('title');
      });
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/roles');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('POST /api/roles', () => {
    it('should return 201 for current user having permission to create user roles', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Нова роль користувача',
          description: '',
          permissions: ['ADD_CATEGORIES', 'ADD_ESTABLISHMENTS', 'ADD_PRODUCTS'],
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Нова роль користувача');
      expect(response.body.description).toBe('');
      expect(response.body.permissions).toHaveLength(3);
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
      roleUuid = response.body.uuid;
    });

    it('should return 404 if you specify permissions that don`t exist', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Нова наступна роль користувача',
          description: '',
          permissions: ['TEST'],
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        'Не вдалося знайти деякі права доступу: TEST'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Нова роль користувача',
          description: '',
          permissions: ['ADD_CATEGORIES', 'ADD_ESTABLISHMENTS', 'ADD_PRODUCTS'],
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Ця роль для користувача вже існує');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to create user roles', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Нова наступна роль користувача',
          description: '',
          permissions: ['ADD_CATEGORIES', 'ADD_ESTABLISHMENTS', 'ADD_PRODUCTS'],
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на додавання ролей для користувачів'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('GET /api/roles/:roleUuid', () => {
    it('should get role by id', async () => {
      const response = await request(app)
        .get(`/api/roles/${roleUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(roleUuid);
      expect(response.body.title).toBe('Нова роль користувача');
      expect(response.body.description).toBe('');
      expect(response.body.permissions).toHaveLength(3);
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing role', async () => {
      const response = await request(app)
        .get('/api/roles/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Роль для користувача не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/roles/${roleUuid}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('PATCH /api/roles/:roleUuid', () => {
    it('should return 200 for current user having permission to edit user roles', async () => {
      const response = await request(app)
        .patch(`/api/roles/${roleUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Оновлена назва ролі',
          description: 'Оновлений опис ролі',
          permissions: [],
        });
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(roleUuid);
      expect(response.body.title).toBe('Оновлена назва ролі');
      expect(response.body.description).toBe('Оновлений опис ролі');
      expect(response.body.permissions).toHaveLength(0);
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/roles/${roleUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Administrators',
          description: 'Оновлений опис ролі',
          permissions: [],
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Ця роль для користувача вже існує');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to edit user roles', async () => {
      const response = await request(app)
        .patch(`/api/roles/${roleUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва ролі',
          description: 'Оновлений опис ролі',
          permissions: [],
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на редагування цієї ролі для користувачів'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 for non-existing role update', async () => {
      const response = await request(app)
        .patch('/api/roles/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Оновлена назва ролі',
          description: 'Оновлений опис ролі',
          permissions: [],
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Роль для користувача не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('DELETE /api/roles/:roleUuid', () => {
    it('should return 403 for current user not having permission to delete user roles', async () => {
      const response = await request(app)
        .delete(`/api/roles/${roleUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на видалення цієї ролі для користувачів'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for current user having permission to delete user roles', async () => {
      const response = await request(app)
        .delete(`/api/roles/${roleUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing role deletion', async () => {
      const response = await request(app)
        .delete('/api/roles/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Роль для користувача не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });
});
