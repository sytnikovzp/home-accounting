/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');
const { initializeDatabase, closeDatabase } = require('../utils/seedMongo');

beforeAll(initializeDatabase);
afterAll(closeDatabase);

const authData = {
  user: { id: null, accessToken: null },
  moderator: { id: null, accessToken: null },
  admin: { id: null, accessToken: null },
};

describe('PurchaseController', () => {
  let purchaseId;

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'Jane.Smith@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Jane Smith');
      expect(response.body.user.role).toBe('User');
      authData.user.id = response.body.user.id;
      authData.user.accessToken = response.body.accessToken;
    });

    it('should login an existing moderator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'Alex.Johnson@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Alex Johnson');
      expect(response.body.user.role).toBe('Moderator');
      authData.moderator.id = response.body.user.id;
      authData.moderator.accessToken = response.body.accessToken;
    });

    it('should login an existing administrator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'John.Doe@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('John Doe');
      expect(response.body.user.role).toBe('Administrator');
      authData.admin.id = response.body.user.id;
      authData.admin.accessToken = response.body.accessToken;
    });
  });

  describe('GET /api/purchases', () => {
    it('should return list of purchases (default pagination)', async () => {
      const response = await request(app)
        .get('/api/purchases')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of purchases (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/purchases')
        .query({ _page: 1, _limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
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
          product: 'Headphones',
          amount: 2,
          price: 500,
          shop: 'Comfy',
          measure: 'unit',
          currency: 'UAH',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.product).toBe('Headphones');
      expect(response.body.amount).toBe('2.00');
      expect(response.body.price).toBe('500.00');
      expect(response.body.summ).toBe('1000.00');
      expect(response.body.shop).toBe('Comfy');
      expect(response.body.measure).toBe('unit');
      expect(response.body.currency).toBe('UAH');
      expect(response.body.createdBy).toBeDefined();
      purchaseId = response.body.id;
    });

    it('should return 404 if you specify shop that don`t exist', async () => {
      const response = await request(app)
        .post('/api/purchases')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Laptop',
          amount: 2,
          price: 100,
          shop: 'Velyka kyshenya',
          measure: 'unit',
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
          product: 'Notebook',
          amount: 2,
          price: 100,
          shop: 'Comfy',
          measure: 'unit',
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
          product: 'Laptop',
          amount: 2,
          price: 100,
          shop: 'Comfy',
          measure: 'liter',
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
          product: 'Laptop',
          amount: 2,
          price: 100,
          shop: 'Comfy',
          measure: 'unit',
          currency: 'YTL',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Currency not found');
    });

    it('should return 403 for current user not having permission to create purchases', async () => {
      const response = await request(app)
        .post('/api/purchases')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          product: 'Laptop',
          amount: 2,
          price: 100,
          shop: 'Comfy',
          measure: 'unit',
          currency: 'USD',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to create purchases'
      );
    });
  });

  describe('GET /api/purchases/:purchaseId', () => {
    it('should get purchase by id', async () => {
      const response = await request(app)
        .get(`/api/purchases/${purchaseId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', purchaseId);
      expect(response.body.product).toBe('Headphones');
      expect(response.body.amount).toBe('2.00');
      expect(response.body.price).toBe('500.00');
      expect(response.body.summ).toBe('1000.00');
      expect(response.body.shop).toBe('Comfy');
      expect(response.body.measure).toBe('unit');
      expect(response.body.currency).toBe('UAH');
      expect(response.body.createdBy).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing purchase', async () => {
      const response = await request(app)
        .get('/api/purchases/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Purchase not found');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/purchases/${purchaseId}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/purchases/:purchaseId', () => {
    it('should return 200 for current user having permission to edit purchases', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Laptop',
          amount: 1,
          price: 850.0,
          shop: 'Epicentr',
          measure: 'unit',
          currency: 'USD',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', purchaseId);
      expect(response.body.product).toBe('Laptop');
      expect(response.body.amount).toBe('1.00');
      expect(response.body.price).toBe('850.00');
      expect(response.body.summ).toBe('850.00');
      expect(response.body.shop).toBe('Epicentr');
      expect(response.body.measure).toBe('unit');
      expect(response.body.currency).toBe('USD');
      expect(response.body.createdBy).toBeDefined();
    });

    it('should return 404 if you specify shop that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Laptop',
          amount: 2,
          price: 100,
          shop: 'Velyka kyshenya',
          measure: 'unit',
          currency: 'USD',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Shop not found');
    });

    it('should return 404 if you specify product that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Notebook',
          amount: 2,
          price: 100,
          shop: 'Comfy',
          measure: 'unit',
          currency: 'USD',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Product not found');
    });

    it('should return 404 if you specify measure that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Laptop',
          amount: 2,
          price: 100,
          shop: 'Comfy',
          measure: 'liter',
          currency: 'USD',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Measure not found');
    });

    it('should return 404 if you specify currency that don`t exist', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          product: 'Laptop',
          amount: 2,
          price: 100,
          shop: 'Comfy',
          measure: 'unit',
          currency: 'YTL',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Currency not found');
    });

    it('should return 403 for current user not having permission to edit purchases', async () => {
      const response = await request(app)
        .patch(`/api/purchases/${purchaseId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          product: 'Laptop',
          amount: 1,
          price: 850.0,
          shop: 'Epicentr',
          measure: 'unit',
          currency: 'USD',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to edit this purchase'
      );
    });

    it('should return 404 for non-existing purchase update', async () => {
      const response = await request(app)
        .patch('/api/purchases/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          product: 'Laptop',
          amount: 1,
          price: 850.0,
          shop: 'Epicentr',
          measure: 'unit',
          currency: 'USD',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Purchase not found');
    });
  });

  describe('DELETE /api/purchases/:purchaseId', () => {
    it('should return 403 for current user not having permission to delete purchases', async () => {
      const response = await request(app)
        .delete(`/api/purchases/${purchaseId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to delete this purchase'
      );
    });

    it('should return 200 for current user having permission to delete purchases', async () => {
      const response = await request(app)
        .delete(`/api/purchases/${purchaseId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing purchase deletion', async () => {
      const response = await request(app)
        .delete('/api/purchases/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Purchase not found');
    });
  });
});
