/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

describe('Category Controller', () => {
  let createdCategoryId;

  test('GET /api/categories - should return all categories', async () => {
    const response = await request(app).get('/api/categories');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/categories/:id - should return category by id', async () => {
    const response = await request(app).get('/api/categories/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
  });

  test('POST /api/categories - should create a new category', async () => {
    const newCategory = {
      title: 'New Category',
      description: 'Category Description',
    };
    const response = await request(app)
      .post('/api/categories')
      .send(newCategory);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newCategory.title);
    createdCategoryId = response.body.id;
  });

  test('PUT /api/categories - should update an existing category', async () => {
    const updatedCategory = {
      id: createdCategoryId,
      title: 'Updated Category',
      description: 'Updated Description',
    };
    const response = await request(app)
      .put('/api/categories')
      .send(updatedCategory);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(updatedCategory.title);
  });

  test('DELETE /api/categories/:id - should delete a category', async () => {
    const response = await request(app).delete(
      `/api/categories/${createdCategoryId}`
    );
    expect(response.status).toBe(200);
  });

  test('GET /api/categories/:id - should return 404 for non-existing category', async () => {
    const response = await request(app).get('/api/categories/9999');
    expect(response.status).toBe(404);
  });
});
