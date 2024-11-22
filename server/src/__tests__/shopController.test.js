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

describe('ShopController', () => {
  let shopId;

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

  describe('GET /api/shops', () => {
    it('should return list of shops (status approoved, default pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of shops (status approoved, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .query({ _page: 1, _limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of shops (status pending, default pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .query({ status: 'pending' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of shops (status pending, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .query({ status: 'pending' })
        .query({ _page: 1, _limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of shops (status rejected, default pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .query({ status: 'rejected' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of shops (status rejected, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/shops')
        .query({ status: 'rejected' })
        .query({ _page: 1, _limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/shops');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/shops', () => {
    it('should return 201 for current user having permission to create shops (as moderator)', async () => {
      const response = await request(app)
        .post('/api/shops')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'New shop by moderator',
          description: 'Test description',
          url: 'https://www.moderator.com',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New shop by moderator');
      expect(response.body.description).toBe('Test description');
      expect(response.body.url).toBe('https://www.moderator.com');
      expect(response.body.status).toBe('approved');
      expect(response.body.reviewedBy).toBeDefined();
      expect(response.body.reviewedAt).toBeDefined();
      expect(response.body.createdBy).toBeDefined();
    });

    it('should return 201 for current user having permission to create shops (as user)', async () => {
      const response = await request(app)
        .post('/api/shops')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'New shop by user',
          description: 'Test description',
          url: 'https://www.user.com',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New shop by user');
      expect(response.body.description).toBe('Test description');
      expect(response.body.url).toBe('https://www.user.com');
      expect(response.body.status).toBe('pending');
      expect(response.body.reviewedBy).toBe('');
      expect(response.body.reviewedAt).toBe('');
      expect(response.body.createdBy).toBeDefined();
      shopId = response.body.id;
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/shops')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'New shop by moderator',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('This shop already exists');
    });

    it('should return 403 for current user not having permission to create shops', async () => {
      const response = await request(app)
        .post('/api/shops')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'New shop',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to create shops'
      );
    });
  });

  describe('GET /api/shops/:shopId', () => {
    it('should get shop by id', async () => {
      const response = await request(app)
        .get(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', shopId);
      expect(response.body.title).toBe('New shop by user');
      expect(response.body.description).toBe('Test description');
      expect(response.body.url).toBe('https://www.user.com');
      expect(response.body).toHaveProperty('logo');
      expect(response.body.status).toBe('pending');
      expect(response.body.reviewedBy).toBe('');
      expect(response.body.reviewedAt).toBe('');
      expect(response.body.createdBy).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing shop', async () => {
      const response = await request(app)
        .get('/api/shops/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Shop not found');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/shops/${shopId}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/shops/:shopId/moderate', () => {
    it('should return 403 for current user not having permission to moderate shops', async () => {
      const response = await request(app)
        .patch(`/api/shops/${shopId}/moderate`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to moderate shops'
      );
    });

    it('should return 200 for current user having permission to moderate shops', async () => {
      const response = await request(app)
        .patch(`/api/shops/${shopId}/moderate`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('New shop by user');
      expect(response.body.status).toBe('approved');
      expect(response.body.reviewedBy).toBeDefined();
      expect(response.body.reviewedAt).toBeDefined();
      expect(response.body.createdBy).toBeDefined();
    });
  });

  describe('PATCH /api/shops/:shopId', () => {
    it('should return 200 for current user having permission to edit shops (as user)', async () => {
      const response = await request(app)
        .patch(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Updated Shop Title',
          description: 'Updated description',
          url: 'https://www.updated.com',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', shopId);
      expect(response.body.title).toBe('Updated Shop Title');
      expect(response.body.description).toBe('Updated description');
      expect(response.body.url).toBe('https://www.updated.com');
      expect(response.body.status).toBe('pending');
      expect(response.body.reviewedBy).toBe('');
      expect(response.body.reviewedAt).toBe('');
      expect(response.body.createdBy).toBeDefined();
    });

    it('should return 200 for current user having permission to edit shops (as moderator)', async () => {
      const response = await request(app)
        .patch(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Updated Shop Title',
          description: 'Updated description',
          url: 'https://www.updated.com',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', shopId);
      expect(response.body.title).toBe('Updated Shop Title');
      expect(response.body.description).toBe('Updated description');
      expect(response.body.url).toBe('https://www.updated.com');
      expect(response.body.status).toBe('approved');
      expect(response.body.reviewedBy).toBeDefined();
      expect(response.body.reviewedAt).toBeDefined();
      expect(response.body.createdBy).toBeDefined();
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Varus',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('This shop already exists');
    });

    it('should return 403 for current user not having permission to edit shops', async () => {
      const response = await request(app)
        .patch(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Updated Shop Title',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to edit this shop'
      );
    });

    it('should return 404 for non-existing shop update', async () => {
      const response = await request(app)
        .patch('/api/shops/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Updated Shop Title',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Shop not found');
    });
  });

  describe('PATCH /api/shops/:shopId/logo', () => {
    it('should update shop logo', async () => {
      const response = await request(app)
        .patch(`/api/shops/${shopId}/logo`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .attach('shopLogo', path.resolve('/Users/nadia/Downloads/atb.png'));
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', shopId);
      expect(response.body).toHaveProperty('logo');
      expect(response.body.logo).toBeDefined();
      expect(response.body.status).toBe('pending');
      expect(response.body.reviewedBy).toBe('');
      expect(response.body.reviewedAt).toBe('');
      expect(response.body.createdBy).toBeDefined();
    });
  });

  describe('PATCH /api/shops/:shopId/delete-logo', () => {
    it('should remove shop logo', async () => {
      const updatedShop = {
        logo: null,
      };
      const response = await request(app)
        .patch(`/api/shops/${shopId}/delete-logo`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send(updatedShop);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', shopId);
      expect(response.body).toHaveProperty('logo');
      expect(response.body.logo).toBe('');
      expect(response.body.status).toBe('pending');
      expect(response.body.reviewedBy).toBe('');
      expect(response.body.reviewedAt).toBe('');
      expect(response.body.createdBy).toBeDefined();
    });
  });

  describe('DELETE /api/shops/:shopId', () => {
    it('should return 403 for current user not having permission to delete shops', async () => {
      const response = await request(app)
        .delete(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to delete this shop'
      );
    });

    it('should return 200 for current user having permission to delete shops', async () => {
      const response = await request(app)
        .delete(`/api/shops/${shopId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing shop deletion', async () => {
      const response = await request(app)
        .delete('/api/shops/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Shop not found');
    });
  });
});
