/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../app');
const { connectMongoDB, closeMongoDB } = require('../db/dbMongo');

beforeAll(connectMongoDB);
afterAll(closeMongoDB);

describe('StatisticsController', () => {
  describe('GET /api/statistics/categories', () => {
    it('should return category statistics for a specific period', async () => {
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

    it('should return category statistics for all time', async () => {
      const response = await request(app).get('/api/statistics/categories');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return an empty array if no data is found', async () => {
      const response = await request(app)
        .get('/api/statistics/categories')
        .query({ ago: 'day' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ result: '0', title: 'Немає даних' }]);
    });
  });

  describe('GET /api/statistics/establishments', () => {
    it('should return establishment statistics for a specific period', async () => {
      const response = await request(app)
        .get('/api/statistics/establishments')
        .query({ ago: 'week' });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return establishment statistics for all time', async () => {
      const response = await request(app).get('/api/statistics/establishments');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app)
        .get('/api/statistics/establishments')
        .query({ creatorUuid: 'invalid' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Невірний формат UUID');
    });
  });

  describe('GET /api/statistics/products', () => {
    it('should return product statistics for a specific period', async () => {
      const response = await request(app)
        .get('/api/statistics/products')
        .query({ ago: 'month' });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return product statistics for all time', async () => {
      const response = await request(app).get('/api/statistics/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should return 400 for an invalid UUID in category statistics', async () => {
      const response = await request(app)
        .get('/api/statistics/categories')
        .query({ creatorUuid: 'invalid' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Невірний формат UUID');
    });
  });
});
