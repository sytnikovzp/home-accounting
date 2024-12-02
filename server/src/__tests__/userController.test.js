/* eslint-disable no-undef */
const path = require('path');
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

describe('UserController', () => {
  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'hanna.shevchenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Ганна Шевченко');
      expect(response.body.user.role).toBe('User');
      expect(response.body.user).toHaveProperty('photo');
      authData.user.id = response.body.user.id;
      authData.user.accessToken = response.body.accessToken;
    });

    it('should login an existing moderator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'oleksandra.ivanchuk@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Олександра Іванчук');
      expect(response.body.user.role).toBe('Moderator');
      expect(response.body.user).toHaveProperty('photo');
      authData.moderator.id = response.body.user.id;
      authData.moderator.accessToken = response.body.accessToken;
    });

    it('should login an existing administrator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'ivan.petrenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Іван Петренко');
      expect(response.body.user.role).toBe('Administrator');
      expect(response.body.user).toHaveProperty('photo');
      authData.admin.id = response.body.user.id;
      authData.admin.accessToken = response.body.accessToken;
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'WrongUser@gmail.com',
        password: 'wrongpassword',
      });
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users', () => {
    it('should get all users (default pagination)', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should get all users (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/users')
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-total-count');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/:userId', () => {
    it('should get user by id', async () => {
      const response = await request(app)
        .get(`/api/users/${authData.user.id}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', authData.user.id);
      expect(response.body.fullName).toBe('Ганна Шевченко');
      expect(response.body.role).toBe('User');
      expect(response.body).toHaveProperty('photo');
      expect(response.body.email).toBe('hanna.shevchenko@gmail.com');
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body).toHaveProperty('permissions');
      expect(Array.isArray(response.body.permissions)).toBe(true);
      expect(response.body.permissions[0]).toHaveProperty('id');
      expect(response.body.permissions[0]).toHaveProperty('title');
      expect(response.body.permissions[0]).toHaveProperty('description');
    });

    it('should return 404 for non-existing user', async () => {
      const response = await request(app)
        .get('/api/users/6725684760b29fc86d0683bd')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Користувача не знайдено');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/users/${authData.user.id}`);
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile data by access token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', authData.user.id);
      expect(response.body.fullName).toBe('Ганна Шевченко');
      expect(response.body.role).toBe('User');
      expect(response.body).toHaveProperty('photo');
      expect(response.body.email).toBe('hanna.shevchenko@gmail.com');
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body).toHaveProperty('permissions');
      expect(Array.isArray(response.body.permissions)).toBe(true);
      expect(response.body.permissions[0]).toHaveProperty('id');
      expect(response.body.permissions[0]).toHaveProperty('title');
      expect(response.body.permissions[0]).toHaveProperty('description');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/users/profile');
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/users/:userId', () => {
    it('should update myself user data without change role', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.id}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          fullName: 'Charlie Updated',
          email: 'Charlie.Updated@Gmail.com',
          role: 'User',
        });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Charlie Updated');
      expect(response.body.user.role).toBe('User');
      authData.user.accessToken = response.body.accessToken;
    });

    it('should update other user data with change role', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.moderator.id}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          fullName: 'Charlie Updated',
          email: 'Charlie.Updated@Gmail.com',
          role: 'Moderator',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'У Вас немає дозволу на оновлення даних цього користувача'
      );
    });

    it('should return 400 if an element with that email already exists', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.id}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          email: 'oleksandra.ivanchuk@gmail.com',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe(
        'Ця електронна адреса вже використовується'
      );
    });

    it('should return 403 for current user not having permission to change user roles', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.id}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          fullName: 'Charlie Updated',
          email: 'Charlie.Updated@Gmail.com',
          role: 'Moderator',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'У Вас немає дозволу на редагування ролі цього користувача'
      );
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.id}`)
        .send({
          fullName: 'Charlie Updated',
          email: 'Charlie.Updated@Gmail.com',
          role: 'User',
        });
      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existing user update', async () => {
      const response = await request(app)
        .patch('/api/users/6725684760b29fc86d0683bd')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          fullName: 'Невірний користувач',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Користувача не знайдено');
    });

    it('should return 200 for current user having permission to change user roles', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.id}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          fullName: 'Charlie Updated',
          email: 'Charlie.Updated@Gmail.com',
          role: 'Moderator',
        });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.fullName).toBe('Charlie Updated');
      expect(response.body.user.role).toBe('Moderator');
    });
  });

  describe('PATCH /api/users/:userId/photo', () => {
    it('should update user photo', async () => {
      const response = await request(app)
        .patch(`/api/users/${authData.user.id}/photo`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .attach('userPhoto', path.resolve('/Users/nadia/Downloads/user.png'));
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', authData.user.id);
      expect(response.body).toHaveProperty('photo');
      expect(response.body.photo).toBeDefined();
    });
  });

  describe('PATCH /api/users/:userId/delete-photo', () => {
    it('should remove user photo', async () => {
      const updatedUser = {
        photo: null,
      };
      const response = await request(app)
        .patch(`/api/users/${authData.user.id}/delete-photo`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', authData.user.id);
      expect(response.body).toHaveProperty('photo');
      expect(response.body.photo).toBe('');
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should return 403 for current user not having permission to delete user', async () => {
      const response = await request(app)
        .delete(`/api/users/${authData.user.id}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на видалення цього профілю користувача'
      );
    });

    it('should return 200 for current user having permission to delete myself user', async () => {
      const response = await request(app)
        .delete(`/api/users/${authData.user.id}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing user deletion', async () => {
      const response = await request(app)
        .delete('/api/users/6725684760b29fc86d0683bd')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
    });
  });
});
