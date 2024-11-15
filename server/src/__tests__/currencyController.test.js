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

describe('CurrencyController', () => {
  let currencyId;

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

  describe('GET /api/currencies', () => {
    it('should return list of currencies', async () => {
      const response = await request(app)
        .get('/api/currencies')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/currencies');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/currencies', () => {
    it('should return 201 for current user having permission to create currencies', async () => {
      const response = await request(app)
        .post('/api/currencies')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'New currency',
          description: '',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New currency');
      expect(response.body.description).toBe('');
      currencyId = response.body.id;
    });

    it('should return 403 for current user not having permission to create currencies', async () => {
      const response = await request(app)
        .post('/api/currencies')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'New currency',
          description: '',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to create currencies'
      );
    });

    it('should return 400 for missing currency title', async () => {
      const response = await request(app)
        .post('/api/currencies')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          description: 'Missing title',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Validation Error');
    });
  });

  describe('GET /api/currencies/:currencyId', () => {
    it('should get currency by id', async () => {
      const response = await request(app)
        .get(`/api/currencies/${currencyId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New currency');
      expect(response.body.description).toBe('');
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing currency', async () => {
      const response = await request(app)
        .get('/api/currencies/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Currency not found');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/currencies/${currencyId}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/currencies/:currencyId', () => {
    it('should return 200 for current user having permission to edit currencies', async () => {
      const response = await request(app)
        .patch(`/api/currencies/${currencyId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Updated Currency Title',
          description: 'Updated description of the currency',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Updated Currency Title');
      expect(response.body.description).toBe(
        'Updated description of the currency'
      );
    });

    it('should return 403 for current user not having permission to edit currencies', async () => {
      const response = await request(app)
        .patch(`/api/currencies/${currencyId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Updated Currency Title',
          description: 'Updated description of the currency',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to edit this currency'
      );
    });

    it('should return 404 for non-existing currency update', async () => {
      const response = await request(app)
        .patch('/api/currencies/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Updated Currency Title',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Currency not found');
    });
  });

  describe('DELETE /api/currencies/:currencyId', () => {
    it('should return 403 for current user not having permission to delete currencies', async () => {
      const response = await request(app)
        .delete(`/api/currencies/${currencyId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to delete this currency'
      );
    });

    it('should return 200 for current user having permission to delete currencies', async () => {
      const response = await request(app)
        .delete(`/api/currencies/${currencyId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing currency deletion', async () => {
      const response = await request(app)
        .delete('/api/currencies/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Currency not found');
    });
  });
});
