/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');
const { initializeDatabase, closeDatabase } = require('../utils/seedMongo');

beforeAll(initializeDatabase);
afterAll(closeDatabase);

const authData = {
  user: { uuid: null, accessToken: null },
  moderator: { uuid: null, accessToken: null },
  admin: { uuid: null, accessToken: null },
};

describe('CurrencyController', () => {
  let currencyUuid;

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
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/currencies');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/currencies', () => {
    it('should return 201 for current user having permission to create currencies', async () => {
      const response = await request(app)
        .post('/api/currencies')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Нова валюта',
          description: '',
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
      expect(response.body.errors[0].title).toBe('Ця валюта вже існує');
    });

    it('should return 403 for current user not having permission to create currencies', async () => {
      const response = await request(app)
        .post('/api/currencies')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Нова валюта',
          description: '',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на створення валют'
      );
    });

    it('should return 400 for missing currency title', async () => {
      const response = await request(app)
        .post('/api/currencies')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          description: 'Відсутня назва',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Validation Error');
    });
  });

  describe('GET /api/currencies/:currencyUuid', () => {
    it('should get currency by id', async () => {
      const response = await request(app)
        .get(`/api/currencies/${currencyUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', currencyUuid);
      expect(response.body.title).toBe('Нова валюта');
      expect(response.body.description).toBe('');
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing currency', async () => {
      const response = await request(app)
        .get('/api/currencies/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Валюту не знайдено');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(
        `/api/currencies/${currencyUuid}`
      );
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/currencies/:currencyUuid', () => {
    it('should return 200 for current user having permission to edit currencies', async () => {
      const response = await request(app)
        .patch(`/api/currencies/${currencyUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва валюти',
          description: 'Оновлений опис валюти',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', currencyUuid);
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
      expect(response.body.errors[0].title).toBe('Ця валюта вже існує');
    });

    it('should return 403 for current user not having permission to edit currencies', async () => {
      const response = await request(app)
        .patch(`/api/currencies/${currencyUuid}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Оновлена назва валюти',
          description: 'Оновлений опис валюти',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на редагування цієї валюти'
      );
    });

    it('should return 404 for non-existing currency update', async () => {
      const response = await request(app)
        .patch('/api/currencies/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва валюти',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Валюту не знайдено');
    });
  });

  describe('DELETE /api/currencies/:currencyUuid', () => {
    it('should return 403 for current user not having permission to delete currencies', async () => {
      const response = await request(app)
        .delete(`/api/currencies/${currencyUuid}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на видалення цієї валюти'
      );
    });

    it('should return 200 for current user having permission to delete currencies', async () => {
      const response = await request(app)
        .delete(`/api/currencies/${currencyUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing currency deletion', async () => {
      const response = await request(app)
        .delete('/api/currencies/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Валюту не знайдено');
    });
  });
});
