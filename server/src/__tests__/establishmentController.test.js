/* eslint-disable no-undef */
const path = require('path');

const request = require('supertest');

const app = require('../app');

const { initializeDatabase, closeDatabase } = require('../utils/seedMongo');

beforeAll(initializeDatabase);
afterAll(closeDatabase);

const authData = {
  admin: { accessToken: null, uuid: null },
  moderator: { accessToken: null, uuid: null },
  user: { accessToken: null, uuid: null },
};

describe('EstablishmentsController', () => {
  let establishmentUuid = null;

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'hanna.shevchenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Ганна Шевченко');
      expect(response.body.user.role).toBe('User');
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
      expect(response.body.user.role).toBe('Moderator');
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
      expect(response.body.user.role).toBe('Administrator');
      authData.admin.uuid = response.body.user.uuid;
      authData.admin.accessToken = response.body.accessToken;
    });
  });

  describe('GET /api/establishments', () => {
    it('should return list of establishments (status approved, default pagination)', async () => {
      const response = await request(app)
        .get('/api/establishments')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of establishments (status approved, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/establishments')
        .query({ limit: 10, page: 1 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return list of establishments (status pending, default pagination)', async () => {
      const response = await request(app)
        .get('/api/establishments')
        .query({ status: 'pending' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of establishments (status pending, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/establishments')
        .query({ status: 'pending' })
        .query({ limit: 10, page: 1 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return list of establishments (status rejected, default pagination)', async () => {
      const response = await request(app)
        .get('/api/establishments')
        .query({ status: 'rejected' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of establishments (status rejected, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/establishments')
        .query({ status: 'rejected' })
        .query({ limit: 10, page: 1 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/establishments');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/establishments', () => {
    it('should return 201 for current user having permission to create establishments (as moderator)', async () => {
      const response = await request(app)
        .post('/api/establishments')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          description: 'Тестовий опис закладу',
          title: 'Новий модераторський заклад',
          url: 'https://www.moderator.com',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Новий модераторський заклад');
      expect(response.body.description).toBe('Тестовий опис закладу');
      expect(response.body.url).toBe('https://www.moderator.com');
      expect(response.body.status).toBe('approved');
      expect(response.body.moderatorUuid).toBeDefined();

      expect(response.body.creatorUuid).toBeDefined();
    });

    it('should return 201 for current user having permission to create establishments (as user)', async () => {
      const response = await request(app)
        .post('/api/establishments')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          description: 'Тестовий опис закладу',
          title: 'Новий користувацький заклад',
          url: 'https://www.user.com',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Новий користувацький заклад');
      expect(response.body.description).toBe('Тестовий опис закладу');
      expect(response.body.url).toBe('https://www.user.com');
      expect(response.body.status).toBe('pending');
      expect(response.body.moderatorUuid).toBe('');

      expect(response.body.creatorUuid).toBeDefined();
      establishmentUuid = response.body.uuid;
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/establishments')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Новий модераторський заклад',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Цей заклад вже існує');
    });

    it('should return 403 for current user not having permission to create establishments', async () => {
      const response = await request(app)
        .post('/api/establishments')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Новий заклад',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на додавання закладів'
      );
    });
  });

  describe('GET /api/establishments/:establishmentUuid', () => {
    it('should get establishment by id', async () => {
      const response = await request(app)
        .get(`/api/establishments/${establishmentUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', establishmentUuid);
      expect(response.body.title).toBe('Новий користувацький заклад');
      expect(response.body.description).toBe('Тестовий опис закладу');
      expect(response.body.url).toBe('https://www.user.com');
      expect(response.body).toHaveProperty('logo');
      expect(response.body.status).toBe('Очікує модерації');
      expect(response.body.moderatorUuid).toBe('');

      expect(response.body.creatorUuid).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing establishment', async () => {
      const response = await request(app)
        .get('/api/establishments/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Заклад не знайдено');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(
        `/api/establishments/${establishmentUuid}`
      );
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/establishments/moderation/:establishmentUuid', () => {
    it('should return 403 for current user not having permission to moderation establishments', async () => {
      const response = await request(app)
        .patch(`/api/establishments/moderation/${establishmentUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на модерацію закладів'
      );
    });

    it('should return 200 for current user having permission to moderation establishments', async () => {
      const response = await request(app)
        .patch(`/api/establishments/moderation/${establishmentUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Новий користувацький заклад');
      expect(response.body.status).toBe('approved');
      expect(response.body.moderatorUuid).toBeDefined();

      expect(response.body.creatorUuid).toBeDefined();
    });
  });

  describe('PATCH /api/establishments/:establishmentUuid', () => {
    it('should return 200 for current user having permission to edit establishments (as user)', async () => {
      const response = await request(app)
        .patch(`/api/establishments/${establishmentUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          description: 'Оновлений опис закладу',
          title: 'Оновлена назва закладу',
          url: 'https://www.updated.com',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', establishmentUuid);
      expect(response.body.title).toBe('Оновлена назва закладу');
      expect(response.body.description).toBe('Оновлений опис закладу');
      expect(response.body.url).toBe('https://www.updated.com');
      expect(response.body.status).toBe('pending');
      expect(response.body.moderatorUuid).toBe('');

      expect(response.body.creatorUuid).toBeDefined();
    });

    it('should return 200 for current user having permission to edit establishments (as moderator)', async () => {
      const response = await request(app)
        .patch(`/api/establishments/${establishmentUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          description: 'Оновлений опис закладу',
          title: 'Оновлена назва закладу',
          url: 'https://www.updated.com',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', establishmentUuid);
      expect(response.body.title).toBe('Оновлена назва закладу');
      expect(response.body.description).toBe('Оновлений опис закладу');
      expect(response.body.url).toBe('https://www.updated.com');
      expect(response.body.status).toBe('approved');
      expect(response.body.moderatorUuid).toBeDefined();

      expect(response.body.creatorUuid).toBeDefined();
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/establishments/${establishmentUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Varus',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Цей заклад вже існує');
    });

    it('should return 403 for current user not having permission to edit establishments', async () => {
      const response = await request(app)
        .patch(`/api/establishments/${establishmentUuid}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Оновлена назва закладу',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на редагування цього закладу'
      );
    });

    it('should return 404 for non-existing establishment update', async () => {
      const response = await request(app)
        .patch('/api/establishments/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва закладу',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Заклад не знайдено');
    });
  });

  describe('PATCH /api/establishments/:establishmentUuid/logo', () => {
    it('should update establishment logo', async () => {
      const response = await request(app)
        .patch(`/api/establishments/${establishmentUuid}/logo`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .attach(
          'establishmentLogo',
          path.resolve('/Users/nadia/Downloads/atb.png')
        );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', establishmentUuid);
      expect(response.body).toHaveProperty('logo');
      expect(response.body.logo).toBeDefined();
      expect(response.body.status).toBe('pending');
      expect(response.body.moderatorUuid).toBe('');

      expect(response.body.creatorUuid).toBeDefined();
    });
  });

  describe('PATCH /api/establishments/:establishmentUuid/logo', () => {
    it('should remove establishment logo', async () => {
      const updatedEstablishment = {
        logo: null,
      };
      const response = await request(app)
        .patch(`/api/establishments/${establishmentUuid}/logo`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send(updatedEstablishment);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', establishmentUuid);
      expect(response.body).toHaveProperty('logo');
      expect(response.body.logo).toBe('');
      expect(response.body.status).toBe('pending');
      expect(response.body.moderatorUuid).toBe('');

      expect(response.body.creatorUuid).toBeDefined();
    });
  });

  describe('DELETE /api/establishments/:establishmentUuid', () => {
    it('should return 403 for current user not having permission to delete establishments', async () => {
      const response = await request(app)
        .delete(`/api/establishments/${establishmentUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на видалення цього закладу'
      );
    });

    it('should return 200 for current user having permission to delete establishments', async () => {
      const response = await request(app)
        .delete(`/api/establishments/${establishmentUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing establishment deletion', async () => {
      const response = await request(app)
        .delete('/api/establishments/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Заклад не знайдено');
    });
  });
});
