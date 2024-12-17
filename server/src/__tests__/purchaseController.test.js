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

describe('PurchaseController', () => {
  let purchaseUuid;

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

  describe('GET /api/purchases', () => {
    it('should return list of purchases (default pagination)', async () => {
      const response = await request(app)
        .get('/api/purchases')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of purchases (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/purchases')
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/purchases');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/purchases', () => {
    it('should return 201 for current user having permission to create purchases', async () => {
      const response = await request(app)
        .post('/api/purchases')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Навушники',
          quantity: 2,
          unitPrice: 500,
          shop: 'Comfy',
          measure: 'шт',
          currency: 'UAH',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.product).toBe('Навушники');
      expect(response.body.quantity).toBe('2.00');
      expect(response.body.unitPrice).toBe('500.00');
      expect(response.body.summ).toBe('1000.00');
      expect(response.body.shop).toBe('Comfy');
      expect(response.body.measure).toBe('шт');
      expect(response.body.currency).toBe('UAH');
      expect(response.body.creatorUuid).toBeDefined();
      purchaseUuid = response.body.uuid;
    });

    it('should return 404 if you specify shop that don`t exist', async () => {
      const response = await request(app)
        .post('/api/purchases')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
          shop: 'Велика кишеня',
          measure: 'шт',
          currency: 'USD',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Shop not found');
    });

    it('should return 404 if you specify product that don`t exist', async () => {
      const response = await request(app)
        .post('/api/purchases')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбуки',
          quantity: 2,
          unitPrice: 100,
          shop: 'Comfy',
          measure: 'шт',
          currency: 'USD',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Product not found');
    });

    it('should return 404 if you specify measure that don`t exist', async () => {
      const response = await request(app)
        .post('/api/purchases')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
          shop: 'Comfy',
          measure: 'літр',
          currency: 'USD',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Measure not found');
    });

    it('should return 404 if you specify currency that don`t exist', async () => {
      const response = await request(app)
        .post('/api/purchases')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
          shop: 'Comfy',
          measure: 'шт',
          currency: 'YYY',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Currency not found');
    });

    it('should return 403 for current user not having permission to create purchases', async () => {
      const response = await request(app)
        .post('/api/purchases')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
          shop: 'Comfy',
          measure: 'шт',
          currency: 'USD',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на створення покупок'
      );
    });
  });

  describe('GET /api/purchases/:purchaseUuid', () => {
    it('should get purchase by id', async () => {
      const response = await request(app)
        .get(`/api/purchases/${purchaseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', purchaseUuid);
      expect(response.body.product).toBe('Навушники');
      expect(response.body.quantity).toBe('2.00');
      expect(response.body.unitPrice).toBe('500.00');
      expect(response.body.summ).toBe('1000.00');
      expect(response.body.shop).toBe('Comfy');
      expect(response.body.measure).toBe('шт');
      expect(response.body.currency).toBe('UAH');
      expect(response.body.creatorUuid).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing purchase', async () => {
      const response = await request(app)
        .get('/api/purchases/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Покупку не знайдено');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/purchases/${purchaseUuid}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/purchases/:purchaseUuid', () => {
    it('should return 200 for current user having permission to edit purchases', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 1,
          unitPrice: 850.0,
          shop: 'Епіцентр',
          measure: 'шт',
          currency: 'USD',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', purchaseUuid);
      expect(response.body.product).toBe('Ноутбук');
      expect(response.body.quantity).toBe('1.00');
      expect(response.body.unitPrice).toBe('850.00');
      expect(response.body.summ).toBe('850.00');
      expect(response.body.shop).toBe('Епіцентр');
      expect(response.body.measure).toBe('шт');
      expect(response.body.currency).toBe('USD');
      expect(response.body.creatorUuid).toBeDefined();
    });

    it('should return 404 if you specify shop that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
          shop: 'Велика кишеня',
          measure: 'шт',
          currency: 'USD',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Shop not found');
    });

    it('should return 404 if you specify product that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбуки',
          quantity: 2,
          unitPrice: 100,
          shop: 'Comfy',
          measure: 'шт',
          currency: 'USD',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Product not found');
    });

    it('should return 404 if you specify measure that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
          shop: 'Comfy',
          measure: 'літр',
          currency: 'USD',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Measure not found');
    });

    it('should return 404 if you specify currency that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 2,
          unitPrice: 100,
          shop: 'Comfy',
          measure: 'шт',
          currency: 'YYY',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Currency not found');
    });

    it('should return 403 for current user not having permission to edit purchases', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseUuid}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 1,
          unitPrice: 850.0,
          shop: 'Епіцентр',
          measure: 'шт',
          currency: 'USD',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на редагування цієї покупки'
      );
    });

    it('should return 404 for non-existing purchase update', async () => {
      const response = await request(app)
        .patch('/api/purchases/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          product: 'Ноутбук',
          quantity: 1,
          unitPrice: 850.0,
          shop: 'Епіцентр',
          measure: 'шт',
          currency: 'USD',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Покупку не знайдено');
    });
  });

  describe('DELETE /api/purchases/:purchaseUuid', () => {
    it('should return 403 for current user not having permission to delete purchases', async () => {
      const response = await request(app)
        .delete(`/api/purchases/${purchaseUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на видалення цієї покупки'
      );
    });

    it('should return 200 for current user having permission to delete purchases', async () => {
      const response = await request(app)
        .delete(`/api/purchases/${purchaseUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing purchase deletion', async () => {
      const response = await request(app)
        .delete('/api/purchases/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Покупку не знайдено');
    });
  });
});
