/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');
const { initializeDatabase, closeDatabase } = require('../utils/seedMongo');

beforeAll(initializeDatabase);
afterAll(closeDatabase);

describe('AuthController', () => {
  let id;
  let accessToken;
  let refreshToken;

  describe('POST /api/auth/registration', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/registration').send({
        fullName: 'John Doe',
        email: 'John@Gmail.com',
        password: 'password123',
      });
      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('john@gmail.com');
      expect(response.body.user.role).toBe('Customer');
      id = response.body.user.id;
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('should return 400 for existing user', async () => {
      const response = await request(app).post('/api/auth/registration').send({
        fullName: 'John Doe',
        email: 'John@Gmail.com',
        password: 'password123',
      });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('This user already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'John@Gmail.com',
        password: 'password123',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('john@gmail.com');
      expect(response.body.user.role).toBe('Customer');
      id = response.body.user.id;
      accessToken = response.body.accessToken;
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
      expect(response.body.user.email).toBe('john@gmail.com');
      expect(response.body.user.role).toBe('Customer');
    });

    it('should return 401 if refresh token is missing', async () => {
      const response = await request(app).get('/api/auth/refresh');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/auth/users', () => {
    it('should get all users', async () => {
      const response = await request(app)
        .get('/api/auth/users')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/auth/users');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/auth/users/:id', () => {
    it('should get user by id', async () => {
      const response = await request(app)
        .get(`/api/auth/users/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.email).toBe('john@gmail.com');
      expect(response.body.role).toBe('Customer');
    });

    it('should return 404 for non-existing user', async () => {
      const response = await request(app)
        .get('/api/auth/users/6725684760b29fc86d0683bd')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(404);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/auth/users/${id}`);
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get user profile data by access token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.email).toBe('john@gmail.com');
      expect(response.body.role).toBe('Customer');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/auth/profile');
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/auth/users/:id', () => {
    it('should update user data', async () => {
      const response = await request(app)
        .patch(`/api/auth/users/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fullName: 'Charlie Updated',
          email: 'Charlie.Updated@Gmail.com',
          role: 'Customer',
        });
      expect(response.status).toBe(201);
      expect(response.body.user.fullName).toBe('Charlie Updated');
      expect(response.body.user.email).toBe('charlie.updated@gmail.com');
      expect(response.body.user.role).toBe('Customer');
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('should return 404 for non-existing user update', async () => {
      const response = await request(app)
        .put('/api/auth/users/6725684760b29fc86d0683bd')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fullName: 'Invalid User',
        });
      expect(response.status).toBe(404);
    });

    it('should return 400 for current user not having permission to change user roles', async () => {
      const response = await request(app)
        .patch(`/api/auth/users/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fullName: 'Charlie Updated',
          email: 'Charlie.Updated@Gmail.com',
          role: 'Moderator',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to change user roles'
      );
    });

    it('should login an existing user with Administrator right', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'John.Doe@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('john.doe@gmail.com');
      expect(response.body.user.role).toBe('Administrator');
      accessToken = response.body.accessToken;
    });

    it('should return 201 for current user having permission to change user roles', async () => {
      const response = await request(app)
        .patch(`/api/auth/users/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fullName: 'Charlie Updated',
          email: 'Charlie.Updated@Gmail.com',
          role: 'Moderator',
        });
      expect(response.status).toBe(201);
      expect(response.body.user.fullName).toBe('Charlie Updated');
      expect(response.body.user.email).toBe('charlie.updated@gmail.com');
      expect(response.body.user.role).toBe('Moderator');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).patch(`/api/auth/users/${id}`).send({
        fullName: 'Charlie Updated',
        email: 'Charlie.Updated@Gmail.com',
        role: 'Customer',
      });
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/auth/users/:id', () => {
    it('should login an existing user with Customer right', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'Jane.Smith@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('jane.smith@gmail.com');
      expect(response.body.user.role).toBe('Customer');
      accessToken = response.body.accessToken;
    });

    it('should return 400 for current user not having permission to delete user', async () => {
      const response = await request(app)
        .delete(`/api/auth/delete/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to delete users'
      );
    });

    it('should login an existing user with Administrator right', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'John.Doe@Gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('john.doe@gmail.com');
      expect(response.body.user.role).toBe('Administrator');
      accessToken = response.body.accessToken;
    });

    it('should return 200 for current user having permission to delete user', async () => {
      const response = await request(app)
        .delete(`/api/auth/delete/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing user deletion', async () => {
      const response = await request(app)
        .delete('/api/auth/delete/6725684760b29fc86d0683bd')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/auth/logout', () => {
    it('should log out the user', async () => {
      const response = await request(app).get('/api/auth/logout');
      expect(response.status).toBe(200);
    });
  });
});