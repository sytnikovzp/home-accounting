/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Purchase Controller', () => {
  let createdPurchaseId;

  test('GET /api/purchases - should return all purchases with pagination', async () => {
    const response = await request(app)
      .get('/api/purchases')
      .query({ _page: 1, _limit: 10 });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.headers['x-total-count']).toBeDefined();
  });

  test('GET /api/purchases - should return all purchases without pagination', async () => {
    const response = await request(app).get('/api/purchases');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.headers['x-total-count']).toBeDefined();
  });

  test('GET /api/purchases/:purchaseId - should return purchase by id', async () => {
    const response = await request(app).get('/api/purchases/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('product');
    expect(response.body).toHaveProperty('amount');
    expect(response.body).toHaveProperty('price');
    expect(response.body).toHaveProperty('summ');
    expect(response.body).toHaveProperty('shop');
    expect(response.body).toHaveProperty('measure');
    expect(response.body).toHaveProperty('currency');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  test('GET /api/purchases/:purchaseId - should return 404 for non-existing purchase', async () => {
    const response = await request(app).get('/api/purchases/9999');
    expect(response.status).toBe(404);
  });

  test('POST /api/purchases - should create a new purchase', async () => {
    const newPurchase = {
      product: 'Headphones',
      amount: 2,
      price: 500,
      shop: 'Comfy',
      measure: 'unit',
      currency: 'UAH',
    };
    const response = await request(app)
      .post('/api/purchases')
      .send(newPurchase);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.product).toBe(newPurchase.product);
    expect(response.body).toHaveProperty('amount');
    expect(response.body).toHaveProperty('price');
    expect(response.body).toHaveProperty('summ');
    expect(response.body.shop).toBe(newPurchase.shop);
    expect(response.body.measure).toBe(newPurchase.measure);
    expect(response.body.currency).toBe(newPurchase.currency);
    createdPurchaseId = response.body.id;
  });

  test('PATCH /api/purchases - should update an existing purchase', async () => {
    const updatedPurchase = {
      product: 'Eggs',
      amount: 10,
      price: 70,
      shop: 'ATB',
      measure: 'unit',
      currency: 'UAH',
    };
    const response = await request(app)
      .patch(`/api/purchases/${createdPurchaseId}`)
      .send(updatedPurchase);
    expect(response.status).toBe(200);
    expect(response.body.product).toBe(updatedPurchase.product);
    expect(response.body).toHaveProperty('amount');
    expect(response.body).toHaveProperty('price');
    expect(response.body).toHaveProperty('summ');
    expect(response.body.shop).toBe(updatedPurchase.shop);
    expect(response.body.measure).toBe(updatedPurchase.measure);
    expect(response.body.currency).toBe(updatedPurchase.currency);
  });

  test('DELETE /api/purchases/:purchaseId - should delete an purchase', async () => {
    const response = await request(app).delete(
      `/api/purchases/${createdPurchaseId}`
    );
    expect(response.status).toBe(200);
  });
});
