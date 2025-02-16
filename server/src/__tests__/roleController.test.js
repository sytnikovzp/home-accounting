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

  describe('GET /api/roles/permissions', () => {
    it('should return list of permissions (default pagination)', async () => {
      const response = await request(app)
        .get('/api/roles/permissions')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should get all permissions (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/roles/permissions')
        .query({ limit: 10, page: 1 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/roles/permissions');
      expect(response.status).toBe(401);
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
        expect(role).toHaveProperty('description');
        expect(role).toHaveProperty('permissions');
        expect(Array.isArray(role.permissions)).toBe(true);
        role.permissions.forEach((permission) => {
          expect(permission).toHaveProperty('uuid');
          expect(permission).toHaveProperty('title');
        });
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
        expect(role).toHaveProperty('description');
        expect(role).toHaveProperty('permissions');
        expect(Array.isArray(role.permissions)).toBe(true);
        role.permissions.forEach((permission) => {
          expect(permission).toHaveProperty('uuid');
          expect(permission).toHaveProperty('title');
        });
      });
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/roles');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/roles', () => {
    it('should return 201 for current user having permission to create user roles', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          description: '',
          permissions: ['ADD_CATEGORIES', 'ADD_ESTABLISHMENTS', 'ADD_PRODUCTS'],
          title: 'Нова роль користувача',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Нова роль користувача');
      expect(response.body.description).toBe('');
      expect(response.body.permissions).toHaveLength(3);
      expect(response.body.permissions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: 'Додавання нових категорій, потребують модерації',
            title: 'ADD_CATEGORIES',
          }),
          expect.objectContaining({
            description: 'Додавання нових закладів, потребують модерації',
            title: 'ADD_ESTABLISHMENTS',
          }),
          expect.objectContaining({
            description: 'Додавання нових товарів, потребують модерації',
            title: 'ADD_PRODUCTS',
          }),
        ])
      );
      roleUuid = response.body.uuid;
    });

    it('should return 404 if you specify permissions that don`t exist', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          description: '',
          permissions: ['ADD_CATEGORIES1'],
          title: 'Нова  наступна роль користувача',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Нова роль користувача',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to create user roles', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          description: 'Роль для цілі тестування',
          title: 'Нова роль користувача',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 400 for missing role title', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          description: 'Відсутня назва',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Помилка');
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
      expect(response.body).toHaveProperty('uuid', roleUuid);
      expect(response.body.title).toBe('Нова роль користувача');
      expect(response.body.description).toBe('');
      expect(response.body.permissions).toHaveLength(3);
      expect(response.body.permissions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: 'Додавання нових категорій, потребують модерації',
            title: 'ADD_CATEGORIES',
          }),
          expect.objectContaining({
            description: 'Додавання нових закладів, потребують модерації',
            title: 'ADD_ESTABLISHMENTS',
          }),
          expect.objectContaining({
            description: 'Додавання нових товарів, потребують модерації',
            title: 'ADD_PRODUCTS',
          }),
        ])
      );
    });

    it('should return 404 for non-existing role', async () => {
      const response = await request(app)
        .get('/api/roles/672b1351a8dc7c9f08add3b6')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/roles/${roleUuid}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/roles/:roleUuid', () => {
    it('should return 200 for current user having permission to edit user roles', async () => {
      const response = await request(app)
        .patch(`/api/roles/${roleUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          description: 'Оновлений опис ролі',
          permissions: [],
          title: 'Оновлена назва ролі',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', roleUuid);
      expect(response.body.title).toBe('Оновлена назва ролі');
      expect(response.body.description).toBe('Оновлений опис ролі');
      expect(response.body.permissions).toHaveLength(0);
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/roles/${roleUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Administrators',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to edit user roles', async () => {
      const response = await request(app)
        .patch(`/api/roles/${roleUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          description: 'Оновлений опис ролі',
          permissions: [],
          title: 'Оновлена назва ролі',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 for non-existing role update', async () => {
      const response = await request(app)
        .patch('/api/roles/6733c59555558d3a0383717c')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Оновлена назва ролі',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
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
      expect(response.body.message).toBe('Помилка');
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
        .delete('/api/roles/6733c59555558d3a0383717c')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });
});
