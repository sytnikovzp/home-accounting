/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');
const { initializeDatabase, closeDatabase } = require('../utils/seedMongo');

beforeAll(initializeDatabase);
afterAll(closeDatabase);

const authData = {
  user: { id: null, accessToken: null },
  moderator: { id: null, accessToken: null },
  admin: { id: null, accessToken: null },
};

describe('MeasureController', () => {
  let measureId;

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'Jane.Smith@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Jane Smith');
      expect(response.body.user.role).toBe('User');
      authData.user.id = response.body.user.id;
      authData.user.accessToken = response.body.accessToken;
    });

    it('should login an existing moderator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'Alex.Johnson@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Alex Johnson');
      expect(response.body.user.role).toBe('Moderator');
      authData.moderator.id = response.body.user.id;
      authData.moderator.accessToken = response.body.accessToken;
    });

    it('should login an existing administrator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'John.Doe@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('John Doe');
      expect(response.body.user.role).toBe('Administrator');
      authData.admin.id = response.body.user.id;
      authData.admin.accessToken = response.body.accessToken;
    });
  });

  describe('GET /api/measures', () => {
    it('should return list of measures (default pagination)', async () => {
      const response = await request(app)
        .get('/api/measures')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return list of measures (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/measures')
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/measures');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/measures', () => {
    it('should return 201 for current user having permission to create measures', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'New measure',
          description: '',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New measure');
      expect(response.body.description).toBe('');
      measureId = response.body.id;
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'New measure',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('This measure already exists');
    });

    it('should return 403 for current user not having permission to create measures', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'New measure',
          description: '',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to create measures'
      );
    });

    it('should return 400 for missing measure title', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          description: 'Missing title',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Validation Error');
    });
  });

  describe('GET /api/measures/:measureId', () => {
    it('should get measure by id', async () => {
      const response = await request(app)
        .get(`/api/measures/${measureId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', measureId);
      expect(response.body.title).toBe('New measure');
      expect(response.body.description).toBe('');
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing measure', async () => {
      const response = await request(app)
        .get('/api/measures/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Measure not found');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/measures/${measureId}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/measures/:measureId', () => {
    it('should return 200 for current user having permission to edit measures', async () => {
      const response = await request(app)
        .patch(`/api/measures/${measureId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Updated Measure Title',
          description: 'Updated description of the measure',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', measureId);
      expect(response.body.title).toBe('Updated Measure Title');
      expect(response.body.description).toBe(
        'Updated description of the measure'
      );
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/measures/${measureId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'кг',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('This measure already exists');
    });

    it('should return 403 for current user not having permission to edit measures', async () => {
      const response = await request(app)
        .patch(`/api/measures/${measureId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Updated Measure Title',
          description: 'Updated description of the measure',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to edit this measure'
      );
    });

    it('should return 404 for non-existing measure update', async () => {
      const response = await request(app)
        .patch('/api/measures/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Updated Measure Title',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Measure not found');
    });
  });

  describe('DELETE /api/measures/:measureId', () => {
    it('should return 403 for current user not having permission to delete measures', async () => {
      const response = await request(app)
        .delete(`/api/measures/${measureId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to delete this measure'
      );
    });

    it('should return 200 for current user having permission to delete measures', async () => {
      const response = await request(app)
        .delete(`/api/measures/${measureId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing measure deletion', async () => {
      const response = await request(app)
        .delete('/api/measures/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Measure not found');
    });
  });
});
