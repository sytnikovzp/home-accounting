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

describe('ExpensesController', () => {
  let expenseUuid = null;

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

  describe('GET /api/expenses', () => {
    it('should return list of expenses (default pagination)', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of expenses (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .query({ limit: 10, page: 1 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/expenses');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/expenses', () => {
    it('should return 201 for current user having permission to create expenses', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          currency: 'UAH',
          establishment: 'Comfy',
          measure: 'шт',
          product: 'Навушники',
          quantity: 2,
          unitPrice: 500,
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.product).toBe('Навушники');
      expect(response.body.quantity).toBe('2.00');
      expect(response.body.unitPrice).toBe('500.00');
      expect(response.body.summ).toBe('1000.00');
      expect(response.body.establishment).toBe('Comfy');
      expect(response.body.measure).toBe('шт');
      expect(response.body.currency).toBe('UAH');
      expect(response.body.creatorUuid).toBeDefined();
      expenseUuid = response.body.uuid;
    });

    it('should return 404 if you specify establishment that don`t exist', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          currency: 'USD',
          establishment: 'Велика кишеня',
          measure: 'шт',
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify product that don`t exist', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          currency: 'USD',
          establishment: 'Comfy',
          measure: 'шт',
          product: 'Ноутбуки',
          quantity: 2,
          unitPrice: 100,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify measure that don`t exist', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          currency: 'USD',
          establishment: 'Comfy',
          measure: 'літр',
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify currency that don`t exist', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          currency: 'YYY',
          establishment: 'Comfy',
          measure: 'шт',
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to create expenses', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          currency: 'USD',
          establishment: 'Comfy',
          measure: 'шт',
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('GET /api/expenses/:expenseUuid', () => {
    it('should get expense by id', async () => {
      const response = await request(app)
        .get(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', expenseUuid);
      expect(response.body.product).toBe('Навушники');
      expect(response.body.quantity).toBe('2.00');
      expect(response.body.unitPrice).toBe('500.00');
      expect(response.body.summ).toBe('1000.00');
      expect(response.body.establishment).toBe('Comfy');
      expect(response.body.measure).toBe('шт');
      expect(response.body.currency).toBe('UAH');
      expect(response.body.creatorUuid).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing expense', async () => {
      const response = await request(app)
        .get('/api/expenses/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/expenses/${expenseUuid}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/expenses/:expenseUuid', () => {
    it('should return 200 for current user having permission to edit expenses', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          currency: 'USD',
          establishment: 'Епіцентр',
          measure: 'шт',
          product: 'Ноутбук',
          quantity: 1,
          unitPrice: 850.0,
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', expenseUuid);
      expect(response.body.product).toBe('Ноутбук');
      expect(response.body.quantity).toBe('1.00');
      expect(response.body.unitPrice).toBe('850.00');
      expect(response.body.summ).toBe('850.00');
      expect(response.body.establishment).toBe('Епіцентр');
      expect(response.body.measure).toBe('шт');
      expect(response.body.currency).toBe('USD');
      expect(response.body.creatorUuid).toBeDefined();
    });

    it('should return 404 if you specify establishment that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          currency: 'USD',
          establishment: 'Велика кишеня',
          measure: 'шт',
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify product that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          currency: 'USD',
          establishment: 'Comfy',
          measure: 'шт',
          product: 'Ноутбуки',
          quantity: 2,
          unitPrice: 100,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify measure that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          currency: 'USD',
          establishment: 'Comfy',
          measure: 'літр',
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify currency that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          currency: 'YYY',
          establishment: 'Comfy',
          measure: 'шт',
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to edit expenses', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          currency: 'USD',
          establishment: 'Епіцентр',
          measure: 'шт',
          product: 'Ноутбук',
          quantity: 1,
          unitPrice: 850.0,
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 for non-existing expense update', async () => {
      const response = await request(app)
        .patch('/api/expenses/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          currency: 'USD',
          establishment: 'Епіцентр',
          measure: 'шт',
          product: 'Ноутбук',
          quantity: 1,
          unitPrice: 850.0,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('DELETE /api/expenses/:expenseUuid', () => {
    it('should return 403 for current user not having permission to delete expenses', async () => {
      const response = await request(app)
        .delete(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for current user having permission to delete expenses', async () => {
      const response = await request(app)
        .delete(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing expense deletion', async () => {
      const response = await request(app)
        .delete('/api/expenses/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });
});
