/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Item Controller', () => {
  let createdItemId;

  test('GET /api/items - should return all items with pagination', async () => {
    const response = await request(app).get('/api/items?limit=10&offset=0');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.headers['x-total-count']).toBeDefined();
  });

  test('GET /api/items - should return all items without pagination', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.headers['x-total-count']).toBeDefined();
  });

  test('GET /api/items/:itemId - should return item by id', async () => {
    const response = await request(app).get('/api/items/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('product');
  });

  test('POST /api/items - should create a new item', async () => {
    const newItem = {
      product: 'Headphones',
      amount: 2,
      price: 500,
      shop: 'Comfy',
      measure: 'unit',
      currency: 'UAH',
    };
    const response = await request(app).post('/api/items').send(newItem);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.product).toBe(newItem.product);
    createdItemId = response.body.id;
  });

  test('PATCH /api/items - should update an existing item', async () => {
    const updatedItem = {
      product: 'Eggs',
      amount: 10,
      price: 70,
      shop: 'ATB',
      measure: 'unit',
      currency: 'UAH',
    };
    const response = await request(app)
      .patch(`/api/items/${createdItemId}`)
      .send(updatedItem);
    expect(response.status).toBe(200);
    expect(response.body.product).toBe(updatedItem.product);
  });

  test('DELETE /api/items/:itemId - should delete an item', async () => {
    const response = await request(app).delete(`/api/items/${createdItemId}`);
    expect(response.status).toBe(200);
  });

  test('GET /api/items/:itemId - should return 404 for non-existing item', async () => {
    const response = await request(app).get('/api/items/9999');
    expect(response.status).toBe(404);
  });
});
