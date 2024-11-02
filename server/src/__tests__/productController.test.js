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
    const response = await request(app).get('/api/products?limit=10&offset=0');
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
  });

  test('POST /api/products - should create a new product', async () => {
    const newProduct = {
      title: 'New Product',
      description: 'Product Description',
      category: 'Electronics',
    };
    const response = await request(app).post('/api/products').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newProduct.title);
    createdProductId = response.body.id;
  });

  test('PATCH /api/products - should update an existing product', async () => {
    const updatedProduct = {
      title: 'Updated Product',
      description: 'Updated Description',
      category: 'Computing',
    };
    const response = await request(app)
      .patch(`/api/products/${createdProductId}`)
      .send(updatedProduct);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(updatedProduct.title);
  });

  test('DELETE /api/products/:productId - should delete a product', async () => {
    const response = await request(app).delete(
      `/api/products/${createdProductId}`
    );
    expect(response.status).toBe(200);
  });

  test('GET /api/products/:productId - should return 404 for non-existing product', async () => {
    const response = await request(app).get('/api/products/9999');
    expect(response.status).toBe(404);
  });
});
