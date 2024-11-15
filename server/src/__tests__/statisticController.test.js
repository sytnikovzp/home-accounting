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

describe('StatisticController', () => {
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

  describe('GET /api/statistics/category-per-period', () => {
    it('should return cost for category with time filter (month)', async () => {
      const response = await request(app)
        .get('/api/statistics/category-per-period')
        .query({ category: 'Household devices', ago: 'month' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ result: '83000.00' }]);
    });

    it('should return the cost by category "Household devices" without time filter', async () => {
      const response = await request(app)
        .get('/api/statistics/category-per-period')
        .query({ category: 'Household devices' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ result: '83000.00' }]);
    });

    it('should return the cost by category "Clothes" with result 0', async () => {
      const response = await request(app)
        .get('/api/statistics/category-per-period')
        .query({ category: 'Clothes' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ result: 0 }]);
    });

    it('should return 404 if category "Test" is not found', async () => {
      const response = await request(app)
        .get('/api/statistics/category-per-period')
        .query({ category: 'Test' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Category not found');
    });
  });

  describe('GET /api/statistics/shop-per-period', () => {
    it('should return total cost for shop "Comfy" with time filter (week)', async () => {
      const response = await request(app)
        .get('/api/statistics/shop-per-period')
        .query({ shop: 'Comfy', ago: 'week' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ result: '49000.00' }]);
    });

    it('should return total cost for shop "ATB" without time filter', async () => {
      const response = await request(app)
        .get('/api/statistics/shop-per-period')
        .query({ shop: 'ATB' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ result: '44.75' }]);
    });

    it('should return 404 error for non-existing shop "Auchan"', async () => {
      const response = await request(app)
        .get('/api/statistics/shop-per-period')
        .query({ shop: 'Auchan' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Shop not found');
    });
  });

  describe('GET /api/statistics/categories', () => {
    it('should return category statistics with time filter (month)', async () => {
      const response = await request(app)
        .get('/api/statistics/categories')
        .query({ ago: 'month' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((purchase) => {
        expect(typeof purchase).toBe('object');
        expect(purchase).toHaveProperty('title');
        expect(purchase).toHaveProperty('result');
      });
    });

    it('should return category statistics without time filter', async () => {
      const response = await request(app)
        .get('/api/statistics/categories')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((purchase) => {
        expect(typeof purchase).toBe('object');
        expect(purchase).toHaveProperty('title');
        expect(purchase).toHaveProperty('result');
      });
    });
  });

  describe('GET /statistics/shops', () => {
    it('should return shop statistics with time filter (month)', async () => {
      const response = await request(app)
        .get('/api/statistics/shops')
        .query({ ago: 'month' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((purchase) => {
        expect(typeof purchase).toBe('object');
        expect(purchase).toHaveProperty('title');
        expect(purchase).toHaveProperty('url');
        expect(purchase).toHaveProperty('logo');
        expect(purchase).toHaveProperty('result');
      });
    });

    it('should return shop statistics without time filter', async () => {
      const response = await request(app)
        .get('/api/statistics/shops')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((purchase) => {
        expect(typeof purchase).toBe('object');
        expect(purchase).toHaveProperty('title');
        expect(purchase).toHaveProperty('url');
        expect(purchase).toHaveProperty('logo');
        expect(purchase).toHaveProperty('result');
      });
    });
  });
});
