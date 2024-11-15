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

describe('RoleController', () => {
  let roleId;

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

  describe('GET /api/roles/permissions', () => {
    it('should return list of permissions (default pagination)', async () => {
      const response = await request(app)
        .get('/api/roles/permissions')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get all permissions (custom pagination)', async () => {
      const response = await request(app)
        .get('/api/roles/permissions')
        .query({ _page: 1, _limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/roles/permissions');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/roles', () => {
    it('should return list of roles', async () => {
      const response = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/roles');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/roles', () => {
    it('should return 201 for current user having permission to create user roles', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'New role',
          description: '',
          permissions: ['ADD_CATEGORIES', 'ADD_SHOPS', 'ADD_PRODUCTS'],
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New role');
      expect(response.body.description).toBe('');
      expect(response.body.permissions).toHaveLength(3);
      expect(response.body.permissions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'ADD_CATEGORIES',
            description: 'Add new categories, which need to be moderated',
          }),
          expect.objectContaining({
            title: 'ADD_SHOPS',
            description: 'Add new shops, which need to be moderated',
          }),
          expect.objectContaining({
            title: 'ADD_PRODUCTS',
            description: 'Add new products, which need to be moderated',
          }),
        ])
      );
      roleId = response.body.id;
    });

    it('should return 404 if you specify permissions that don`t exist', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'New second role',
          description: '',
          permissions: ['ADD_CATEGORIES1'],
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe(
        'Some permissions were not found: ADD_CATEGORIES1'
      );
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'New role',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('This role already exists');
    });

    it('should return 403 for current user not having permission to create user roles', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'New Role',
          description: 'Role for testing purposes',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to create roles for users'
      );
    });

    it('should return 400 for missing role title', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          description: 'Missing title',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Validation Error');
    });
  });

  describe('GET /api/roles/:roleId', () => {
    it('should get role by id', async () => {
      const response = await request(app)
        .get(`/api/roles/${roleId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', roleId);
      expect(response.body.title).toBe('New role');
      expect(response.body.description).toBe('');
      expect(response.body.permissions).toHaveLength(3);
      expect(response.body.permissions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'ADD_CATEGORIES',
            description: 'Add new categories, which need to be moderated',
          }),
          expect.objectContaining({
            title: 'ADD_SHOPS',
            description: 'Add new shops, which need to be moderated',
          }),
          expect.objectContaining({
            title: 'ADD_PRODUCTS',
            description: 'Add new products, which need to be moderated',
          }),
        ])
      );
    });

    it('should return 404 for non-existing role', async () => {
      const response = await request(app)
        .get('/api/roles/672b1351a8dc7c9f08add3b6')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Role not found');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/roles/${roleId}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/roles/:roleId', () => {
    it('should return 200 for current user having permission to edit user roles', async () => {
      const response = await request(app)
        .patch(`/api/roles/${roleId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Updated Role Title',
          description: 'Updated description of the role',
          permissions: [],
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', roleId);
      expect(response.body.title).toBe('Updated Role Title');
      expect(response.body.description).toBe('Updated description of the role');
      expect(response.body.permissions).toHaveLength(0);
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/roles/${roleId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Administrator',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('This role already exists');
    });

    it('should return 403 for current user not having permission to edit user roles', async () => {
      const response = await request(app)
        .patch(`/api/roles/${roleId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Updated Role Title',
          description: 'Updated description of the role',
          permissions: [],
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to edit roles for users'
      );
    });

    it('should return 404 for non-existing role update', async () => {
      const response = await request(app)
        .patch('/api/roles/6733c59555558d3a0383717c')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Updated Role Title',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Role not found');
    });
  });

  describe('DELETE /api/roles/:roleId', () => {
    it('should return 403 for current user not having permission to delete user roles', async () => {
      const response = await request(app)
        .delete(`/api/roles/${roleId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to delete roles for users'
      );
    });

    it('should return 200 for current user having permission to delete user roles', async () => {
      const response = await request(app)
        .delete(`/api/roles/${roleId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing role deletion', async () => {
      const response = await request(app)
        .delete('/api/roles/6733c59555558d3a0383717c')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Role not found');
    });
  });
});
