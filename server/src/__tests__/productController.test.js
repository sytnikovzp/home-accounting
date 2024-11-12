/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Product Controller', () => {
  let createdProductId;

  test('GET /api/products - should return all products with pagination', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ _page: 1, _limit: 10 });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.headers['x-total-count']).toBeDefined();
  });

  test('GET /api/products - should return all products without pagination', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.headers['x-total-count']).toBeDefined();
  });

  test('GET /api/products/:productId - should return product by id', async () => {
    const response = await request(app).get('/api/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('category');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  test('GET /api/products/:productId - should return 404 for non-existing product', async () => {
    const response = await request(app).get('/api/products/9999');
    expect(response.status).toBe(404);
  });

  test('POST /api/products - should create a new product', async () => {
    const newProduct = {
      title: 'New Product',
      category: 'Electronics',
    };
    const response = await request(app).post('/api/products').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newProduct.title);
    expect(response.body.category).toBe(newProduct.category);
    createdProductId = response.body.id;
  });

  test('PATCH /api/products - should update an existing product', async () => {
    const updatedProduct = {
      title: 'Updated Product',
      category: 'Computing',
    };
    const response = await request(app)
      .patch(`/api/products/${createdProductId}`)
      .send(updatedProduct);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedProduct.title);
    expect(response.body.category).toBe(updatedProduct.category);
  });

  test('DELETE /api/products/:productId - should delete a product', async () => {
    const response = await request(app).delete(
      `/api/products/${createdProductId}`
    );
    expect(response.status).toBe(200);
  });
});
