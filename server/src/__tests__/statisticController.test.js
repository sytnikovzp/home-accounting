/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../app');

const { initializeDatabase, closeDatabase } = require('../utils/seedMongo');

beforeAll(initializeDatabase);
afterAll(closeDatabase);

describe('StatisticsController', () => {
  describe('GET /api/statistics/category-per-period', () => {
    it('should return cost for category with time filter (month)', async () => {
      const response = await request(app)
        .get('/api/statistics/category-per-period')
        .query({ category: 'Побутові пристрої', ago: 'month' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ result: '83000.00' }]);
    });

    it('should return the cost by category "Побутові пристрої" without time filter', async () => {
      const response = await request(app)
        .get('/api/statistics/category-per-period')
        .query({ category: 'Побутові пристрої' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ result: '83000.00' }]);
    });

    it('should return the cost by category "Одяг" with result 0', async () => {
      const response = await request(app)
        .get('/api/statistics/category-per-period')
        .query({ category: 'Одяг' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ result: 0 }]);
    });

    it('should return 404 if category "Test" is not found', async () => {
      const response = await request(app)
        .get('/api/statistics/category-per-period')
        .query({ category: 'Test' });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Category not found');
    });
  });

  describe('GET /api/statistics/establishment-per-period', () => {
    it('should return total cost for establishment "Comfy" with time filter (week)', async () => {
      const response = await request(app)
        .get('/api/statistics/establishment-per-period')
        .query({ establishment: 'Comfy', ago: 'week' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ result: '49000.00' }]);
    });

    it('should return total cost for establishment "АТБ" without time filter', async () => {
      const response = await request(app)
        .get('/api/statistics/establishment-per-period')
        .query({ establishment: 'АТБ' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ result: '44.75' }]);
    });

    it('should return 404 error for non-existing establishment "Ашан"', async () => {
      const response = await request(app)
        .get('/api/statistics/establishment-per-period')
        .query({ establishment: 'Ашан' });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Establishment not found');
    });
  });

  describe('GET /api/statistics/categories', () => {
    it('should return category statistics with time filter (month)', async () => {
      const response = await request(app)
        .get('/api/statistics/categories')
        .query({ ago: 'month' });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((expense) => {
        expect(typeof expense).toBe('object');
        expect(expense).toHaveProperty('title');
        expect(expense).toHaveProperty('result');
      });
    });

    it('should return category statistics without time filter', async () => {
      const response = await request(app).get('/api/statistics/categories');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((expense) => {
        expect(typeof expense).toBe('object');
        expect(expense).toHaveProperty('title');
        expect(expense).toHaveProperty('result');
      });
    });
  });

  describe('GET /statistics/establishments', () => {
    it('should return establishment statistics with time filter (month)', async () => {
      const response = await request(app)
        .get('/api/statistics/establishments')
        .query({ ago: 'month' });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((expense) => {
        expect(typeof expense).toBe('object');
        expect(expense).toHaveProperty('title');
        expect(expense).toHaveProperty('url');
        expect(expense).toHaveProperty('logo');
        expect(expense).toHaveProperty('result');
      });
    });

    it('should return establishment statistics without time filter', async () => {
      const response = await request(app).get('/api/statistics/establishments');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((expense) => {
        expect(typeof expense).toBe('object');
        expect(expense).toHaveProperty('title');
        expect(expense).toHaveProperty('url');
        expect(expense).toHaveProperty('logo');
        expect(expense).toHaveProperty('result');
      });
    });
  });
});
