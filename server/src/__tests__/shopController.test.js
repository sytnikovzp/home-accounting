/* eslint-disable no-undef */
const path = require('path');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Shop Controller', () => {
  let createdShopId;

  test('GET /api/shops - should return all shops with pagination', async () => {
    const response = await request(app)
      .get('/api/shops')
      .query({ _page: 1, _limit: 10 });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.headers['x-total-count']).toBeDefined();
  });

  test('GET /api/shops - should return all shops without pagination', async () => {
    const response = await request(app).get('/api/shops');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.headers['x-total-count']).toBeDefined();
  });

  test('GET /api/shops/:shopId - should return shop by id', async () => {
    const response = await request(app).get('/api/shops/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('url');
    expect(response.body).toHaveProperty('logo');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  test('GET /api/shops/:shopId - should return 404 for non-existing shop', async () => {
    const response = await request(app).get('/api/shops/9999');
    expect(response.status).toBe(404);
  });

  test('POST /api/shops - should create a new shop', async () => {
    const newShop = {
      title: 'New Shop',
      description: 'Shop Description',
      url: 'https://newshop.com',
    };
    const response = await request(app).post('/api/shops').send(newShop);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newShop.title);
    expect(response.body.description).toBe(newShop.description);
    expect(response.body.url).toBe(newShop.url);
    createdShopId = response.body.id;
  });

  test('PATCH /api/shops/:shopId - should update an existing shop', async () => {
    const updatedShop = {
      title: 'Updated Shop',
      description: 'Updated Description',
      url: 'https://updatedshop.com',
    };
    const response = await request(app)
      .patch(`/api/shops/${createdShopId}`)
      .send(updatedShop);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedShop.title);
    expect(response.body.description).toBe(updatedShop.description);
    expect(response.body.url).toBe(updatedShop.url);
  });

  test('PATCH /api/shops/:shopId/logo - should update shop logo', async () => {
    const response = await request(app)
      .patch(`/api/shops/${createdShopId}/logo`)
      .attach('shopLogo', path.resolve('/Users/nadia/Downloads/atb.png'));
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdShopId);
    expect(response.body).toHaveProperty('logo');
    expect(response.body.logo).toBeDefined();
  });

  test('PATCH /api/shops/:shopId/logo - should remove shop logo', async () => {
    const updatedShop = {
      logo: null,
    };
    const response = await request(app)
      .patch(`/api/shops/${createdShopId}/remlogo`)
      .send(updatedShop);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('logo');
    expect(response.body.logo).toBe('');
  });

  test('DELETE /api/shops/:shopId - should delete a shop', async () => {
    const response = await request(app).delete(`/api/shops/${createdShopId}`);
    expect(response.status).toBe(200);
  });
});
