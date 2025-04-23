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

describe('MeasuresController', () => {
  let measureUuid = null;

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

  describe('GET /api/measures', () => {
    it('should return list of measures (default pagination)', async () => {
      const response = await request(app)
        .get('/api/measures')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of measures (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/measures')
        .query({ limit: 10, page: 1 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/measures');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('POST /api/measures', () => {
    it('should return 201 for current user having permission to create measures', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Нова одиниця вимірів',
          description: 'Тестовий опис',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Нова одиниця вимірів');
      expect(response.body.description).toBe('Тестовий опис');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
      measureUuid = response.body.uuid;
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Нова одиниця вимірів',
          description: 'Тестовий опис',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Ця одиниця вимірів вже існує');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to create measures', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Нова одиниця',
          description: 'Тестовий опис',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на додавання одиниць вимірів'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('GET /api/measures/:measureUuid', () => {
    it('should get measure by id', async () => {
      const response = await request(app)
        .get(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(measureUuid);
      expect(response.body.title).toBe('Нова одиниця вимірів');
      expect(response.body.description).toBe('Тестовий опис');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing measure', async () => {
      const response = await request(app)
        .get('/api/measures/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Одиницю вимірів не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/measures/${measureUuid}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('PATCH /api/measures/:measureUuid', () => {
    it('should return 200 for current user having permission to edit measures', async () => {
      const response = await request(app)
        .patch(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва одиниці вимірів',
          description: 'Оновлений опис одиниці вимірів',
        });
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(measureUuid);
      expect(response.body.title).toBe('Оновлена назва одиниці вимірів');
      expect(response.body.description).toBe('Оновлений опис одиниці вимірів');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'кг',
          description: 'кілограм',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Ця одиниця вимірів вже існує');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to edit measures', async () => {
      const response = await request(app)
        .patch(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          title: 'Оновлена назва одиниці вимірів',
          description: 'Оновлений опис одиниці вимірів',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на редагування цієї одиниці вимірів'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 for non-existing measure update', async () => {
      const response = await request(app)
        .patch('/api/measures/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва одиниці вимірів',
          description: 'Оновлений опис одиниці вимірів',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Одиницю вимірів не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('DELETE /api/measures/:measureUuid', () => {
    it('should return 403 for current user not having permission to delete measures', async () => {
      const response = await request(app)
        .delete(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на видалення цієї одиниці вимірів'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for current user having permission to delete measures', async () => {
      const response = await request(app)
        .delete(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing measure deletion', async () => {
      const response = await request(app)
        .delete('/api/measures/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Одиницю вимірів не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });
});
