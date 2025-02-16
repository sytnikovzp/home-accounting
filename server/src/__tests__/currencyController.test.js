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

describe('CurrenciesController', () => {
  let currencyUuid = null;

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

  describe('GET /api/currencies', () => {
    it('should return list of currencies (default pagination)', async () => {
      const response = await request(app)
        .get('/api/currencies')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of currencies (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/currencies')
        .query({ limit: 10, page: 1 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/currencies');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('POST /api/currencies', () => {
    it('should return 201 for current user having permission to create currencies', async () => {
      const response = await request(app)
        .post('/api/currencies')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          description: '',
          title: 'Нова валюта',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Нова валюта');
      expect(response.body.description).toBe('');
      currencyUuid = response.body.uuid;
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/currencies')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Нова валюта',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to create currencies', async () => {
      const response = await request(app)
        .post('/api/currencies')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          description: '',
          title: 'Нова валюта',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 400 for missing currency title', async () => {
      const response = await request(app)
        .post('/api/currencies')
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

  describe('GET /api/currencies/:currencyUuid', () => {
    it('should get currency by id', async () => {
      const response = await request(app)
        .get(`/api/currencies/${currencyUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(currencyUuid);
      expect(response.body.title).toBe('Нова валюта');
      expect(response.body.description).toBe('');
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing currency', async () => {
      const response = await request(app)
        .get('/api/currencies/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(
        `/api/currencies/${currencyUuid}`
      );
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('PATCH /api/currencies/:currencyUuid', () => {
    it('should return 200 for current user having permission to edit currencies', async () => {
      const response = await request(app)
        .patch(`/api/currencies/${currencyUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          description: 'Оновлений опис валюти',
          title: 'Оновлена назва валюти',
        });
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(currencyUuid);
      expect(response.body.title).toBe('Оновлена назва валюти');
      expect(response.body.description).toBe('Оновлений опис валюти');
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/currencies/${currencyUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'USD',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to edit currencies', async () => {
      const response = await request(app)
        .patch(`/api/currencies/${currencyUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          description: 'Оновлений опис валюти',
          title: 'Оновлена назва валюти',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 for non-existing currency update', async () => {
      const response = await request(app)
        .patch('/api/currencies/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва валюти',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('DELETE /api/currencies/:currencyUuid', () => {
    it('should return 403 for current user not having permission to delete currencies', async () => {
      const response = await request(app)
        .delete(`/api/currencies/${currencyUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for current user having permission to delete currencies', async () => {
      const response = await request(app)
        .delete(`/api/currencies/${currencyUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing currency deletion', async () => {
      const response = await request(app)
        .delete('/api/currencies/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });
});
