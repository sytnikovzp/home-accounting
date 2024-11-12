/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');
const { initializeDatabase, closeDatabase } = require('../utils/seedMongo');

beforeAll(initializeDatabase);
afterAll(closeDatabase);

describe('AuthController', () => {
  let refreshToken;

  describe('POST /api/auth/registration', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/registration').send({
        fullName: 'John Doe',
        email: 'John@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('John Doe');
      expect(response.body.user.role).toBe('User');
      expect(response.body.user).toHaveProperty('photo');
      refreshToken = response.body.refreshToken;
    });

    it('should return 400 for existing user', async () => {
      const response = await request(app).post('/api/auth/registration').send({
        fullName: 'John Doe',
        email: 'John@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('This user already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'John@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('John Doe');
      expect(response.body.user.role).toBe('User');
      expect(response.body.user).toHaveProperty('photo');
      refreshToken = response.body.refreshToken;
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'WrongUser@gmail.com',
        password: 'wrongpassword',
      });
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/auth/refresh', () => {
    it('should refresh token', async () => {
      const response = await request(app)
        .get('/api/auth/refresh')
        .set('Cookie', `refreshToken=${refreshToken}`);
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('John Doe');
      expect(response.body.user.role).toBe('User');
      expect(response.body.user).toHaveProperty('photo');
    });

    it('should return 401 if refresh token is missing', async () => {
      const response = await request(app).get('/api/auth/refresh');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/auth/logout', () => {
    it('should logout the user', async () => {
      const response = await request(app).get('/api/auth/logout');
      expect(response.status).toBe(200);
    });
  });
});
