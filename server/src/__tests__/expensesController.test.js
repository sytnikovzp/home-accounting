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

  describe('GET /api/expenses', () => {
    it('should return list of expenses (default pagination)', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(response.headers).toHaveProperty('x-total-sum');
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
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('POST /api/expenses', () => {
    it('should return 201 for current user having permission to create expenses', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Навушники',
          quantity: 2,
          measure: 'шт',
          unitPrice: 500,
          currency: 'Українська гривня',
          establishment: 'Comfy',
          date: '12 січня 2025',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.product.title).toBe('Навушники');
      expect(response.body.quantity).toBe('2.00');
      expect(response.body.unitPrice).toBe('500.00');
      expect(response.body.totalPrice).toBe('1000.00');
      expect(response.body.establishment.title).toBe('Comfy');
      expect(response.body.measure.title).toBe('шт');
      expect(response.body.currency.title).toBe('Українська гривня');
      expect(response.body.date).toBe('12 січня 2025');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
      expenseUuid = response.body.uuid;
    });

    it('should return 404 if you specify establishment that don`t exist', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          measure: 'шт',
          unitPrice: 100,
          currency: 'Українська гривня',
          establishment: 'Велика кишеня',
          date: '12 січня 2025',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Establishment не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify product that don`t exist', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбуки',
          quantity: 2,
          measure: 'шт',
          unitPrice: 100,
          currency: 'Українська гривня',
          establishment: 'Comfy',
          date: '12 січня 2025',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify measure that don`t exist', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          measure: 'літр',
          unitPrice: 100,
          currency: 'Українська гривня',
          establishment: 'Comfy',
          date: '12 січня 2025',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Measure не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify currency that don`t exist', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          measure: 'шт',
          unitPrice: 100,
          currency: 'YYY',
          establishment: 'Comfy',
          date: '12 січня 2025',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Currency не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to create expenses', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          measure: 'шт',
          unitPrice: 100,
          currency: 'Українська гривня',
          establishment: 'Comfy',
          date: '12 січня 2025',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на додавання витрат'
      );
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
      expect(response.body.uuid).toBe(expenseUuid);
      expect(response.body.product.title).toBe('Навушники');
      expect(response.body.quantity).toBe('2.00');
      expect(response.body.measure.title).toBe('шт');
      expect(response.body.unitPrice).toBe('500.00');
      expect(response.body.totalPrice).toBe('1000.00');
      expect(response.body.currency.title).toBe('Українська гривня');
      expect(response.body.establishment.title).toBe('Comfy');
      expect(response.body.date).toBe('12 січня 2025');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing expense', async () => {
      const response = await request(app)
        .get('/api/expenses/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Витрату не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/expenses/${expenseUuid}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('PATCH /api/expenses/:expenseUuid', () => {
    it('should return 200 for current user having permission to edit expenses', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 1,
          measure: 'шт',
          unitPrice: 8500.0,
          currency: 'Українська гривня',
          establishment: 'Епіцентр',
          date: '15 січня 2025',
        });
      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(expenseUuid);
      expect(response.body.product.title).toBe('Ноутбук');
      expect(response.body.quantity).toBe('1.00');
      expect(response.body.measure.title).toBe('шт');
      expect(response.body.unitPrice).toBe('8500.00');
      expect(response.body.totalPrice).toBe('8500.00');
      expect(response.body.currency.title).toBe('Українська гривня');
      expect(response.body.establishment.title).toBe('Епіцентр');
      expect(response.body.date).toBe('15 січня 2025');
      expect(response.body.creation.creatorUuid).toBeDefined();
      expect(response.body.creation.creatorFullName).toBeDefined();
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 404 if you specify establishment that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          measure: 'шт',
          unitPrice: 100,
          currency: 'Українська гривня',
          establishment: 'Велика кишеня',
          date: '15 грудня 2024',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Establishment не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify product that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбуки',
          quantity: 2,
          measure: 'шт',
          unitPrice: 100,
          currency: 'Українська гривня',
          establishment: 'Comfy',
          date: '15 грудня 2024',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify measure that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          measure: 'літр',
          unitPrice: 100,
          currency: 'Українська гривня',
          establishment: 'Comfy',
          date: '15 грудня 2024',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Measure не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 if you specify currency that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          measure: 'шт',
          unitPrice: 100,
          currency: 'YYY',
          establishment: 'Comfy',
          date: '15 грудня 2024',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Currency не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to edit expenses', async () => {
      const response = await request(app)
        .patch(`/api/expenses/${expenseUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 1,
          measure: 'шт',
          unitPrice: 850.0,
          currency: 'Українська гривня',
          establishment: 'Епіцентр',
          date: '15 грудня 2024',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на редагування цієї витрати'
      );
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 for non-existing expense update', async () => {
      const response = await request(app)
        .patch('/api/expenses/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 1,
          measure: 'шт',
          unitPrice: 850.0,
          currency: 'Українська гривня',
          establishment: 'Епіцентр',
          date: '15 грудня 2024',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Витрату не знайдено');
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
      expect(response.body.message).toBe(
        'Ви не маєте дозволу на видалення цієї витрати'
      );
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
      expect(response.body.message).toBe('Витрату не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });
});
