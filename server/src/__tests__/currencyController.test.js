/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Currency Controller', () => {
  let createdCurrencyId;

  test('GET /api/currencies - should return all currencies', async () => {
    const response = await request(app).get('/api/currencies');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/currencies/:currencyId - should return currency by id', async () => {
    const response = await request(app).get('/api/currencies/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
  });

  test('POST /api/currencies - should create a new currency', async () => {
    const newCurrency = {
      title: 'New Currency',
      description: 'Currency Description',
    };
    const response = await request(app)
      .post('/api/currencies')
      .send(newCurrency);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newCurrency.title);
    createdCurrencyId = response.body.id;
  });

  test('PUT /api/currencies - should update an existing currency', async () => {
    const updatedCurrency = {
      id: createdCurrencyId,
      title: 'Updated Currency',
      description: 'Updated Description',
    };
    const response = await request(app)
      .put('/api/currencies')
      .send(updatedCurrency);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(updatedCurrency.title);
  });

  test('DELETE /api/currencies/:currencyId - should delete a currency', async () => {
    const response = await request(app).delete(
      `/api/currencies/${createdCurrencyId}`
    );
    expect(response.status).toBe(200);
  });

  test('GET /api/currencies/:currencyId - should return 404 for non-existing currency', async () => {
    const response = await request(app).get('/api/currencies/9999');
    expect(response.status).toBe(404);
  });
});
