/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /api/statistics/category-per-period', () => {
  it('should return cost for category with time filter (month)', async () => {
    const response = await request(app)
      .get('/api/statistics/category-per-period')
      .query({ category: 'Household devices', ago: 'month' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ result: '83000.00' }]);
  });

  it('should return the cost by category "Household devices" without time filter', async () => {
    const response = await request(app)
      .get('/api/statistics/category-per-period')
      .query({ category: 'Household devices' })
      .expect(200);
    expect(response.body).toEqual([{ result: '83000.00' }]);
  });

  it('should return the cost by category "Clothes" with result 0', async () => {
    const response = await request(app)
      .get('/api/statistics/category-per-period')
      .query({ category: 'Clothes' })
      .expect(200);
    expect(response.body).toEqual([{ result: 0 }]);
  });

  it('should return 404 if category "Test" is not found', async () => {
    const response = await request(app)
      .get('/api/statistics/category-per-period')
      .query({ category: 'Test' })
      .expect(404);
    expect(response.body.errors[0].title).toBe('Category not found');
  });
});

describe('GET /api/statistics/shop-per-period', () => {
  it('should return total cost for shop "Comfy" with time filter (week)', async () => {
    const response = await request(app)
      .get('/api/statistics/shop-per-period')
      .query({ shop: 'Comfy', ago: 'week' })
      .expect(200);
    expect(response.body).toEqual([{ result: '49000.00' }]);
  });

  it('should return total cost for shop "ATB" without time filter', async () => {
    const response = await request(app)
      .get('/api/statistics/shop-per-period')
      .query({ shop: 'ATB' })
      .expect(200);
    expect(response.body).toEqual([{ result: '44.75' }]);
  });

  it('should return 404 error for non-existing shop "Auchan"', async () => {
    const response = await request(app)
      .get('/api/statistics/shop-per-period')
      .query({ shop: 'Auchan' })
      .expect(404);
    expect(response.body.errors[0].title).toBe('Shop not found');
  });
});

describe('GET /api/statistics/categories', () => {
  it('should return category statistics with time filter (month)', async () => {
    const response = await request(app)
      .get('/api/statistics/categories')
      .query({ ago: 'month' })
      .expect(200);
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
      .expect(200);
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
      .expect(200);
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
      .expect(200);
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
