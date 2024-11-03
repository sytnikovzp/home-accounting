/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Measure Controller', () => {
  let createdMeasureId;

  test('GET /api/measures - should return all measures', async () => {
    const response = await request(app).get('/api/measures');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/measures/:measureId - should return measure by id', async () => {
    const response = await request(app).get('/api/measures/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  test('GET /api/measures/:measureId - should return 404 for non-existing measure', async () => {
    const response = await request(app).get('/api/measures/9999');
    expect(response.status).toBe(404);
  });

  test('POST /api/measures - should create a new measure', async () => {
    const newMeasure = {
      title: 'New Measure',
      description: 'Measure Description',
    };
    const response = await request(app).post('/api/measures').send(newMeasure);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newMeasure.title);
    createdMeasureId = response.body.id;
  });

  test('PATCH /api/measures - should update an existing measure', async () => {
    const updatedMeasure = {
      title: 'Updated Measure',
      description: 'Updated Description',
    };
    const response = await request(app)
      .patch(`/api/measures/${createdMeasureId}`)
      .send(updatedMeasure);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedMeasure.title);
  });

  test('DELETE /api/measures/:measureId - should delete a measure', async () => {
    const response = await request(app).delete(
      `/api/measures/${createdMeasureId}`
    );
    expect(response.status).toBe(200);
  });
});
