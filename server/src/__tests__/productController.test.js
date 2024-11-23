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

describe('ProductController', () => {
  let productId;

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

  describe('GET /api/products', () => {
    it('should return list of products (status approoved, default pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of products (status approoved, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of products (status pending, default pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ status: 'pending' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of products (status pending, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ status: 'pending' })
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of products (status rejected, default pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ status: 'rejected' })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return list of products (status rejected, custom pagination)', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ status: 'rejected' })
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/products', () => {
    it('should return 201 for current user having permission to create products (as moderator)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'New product by moderator',
          category: 'Devices',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New product by moderator');
      expect(response.body.category).toBe('Devices');
      expect(response.body.status).toBe('approved');
      expect(response.body.reviewedBy).toBeDefined();
      expect(response.body.reviewedAt).toBeDefined();
      expect(response.body.createdBy).toBeDefined();
    });

    it('should return 201 for current user having permission to create products (as user)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'New product by user',
          category: 'Electronics',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New product by user');
      expect(response.body.category).toBe('Electronics');
      expect(response.body.status).toBe('pending');
      expect(response.body.reviewedBy).toBe('');
      expect(response.body.reviewedAt).toBe('');
      expect(response.body.createdBy).toBeDefined();
      productId = response.body.id;
    });

    it('should return 404 if you specify category that don`t exist', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'New product',
          category: 'Cars',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Category not found');
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'New product by moderator',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('This product already exists');
    });

    it('should return 403 for current user not having permission to create products', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'New product',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to create products'
      );
    });
  });

  describe('GET /api/products/:productId', () => {
    it('should get product by id', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', productId);
      expect(response.body.title).toBe('New product by user');
      expect(response.body.category).toBe('Electronics');
      expect(response.body.status).toBe('pending');
      expect(response.body.reviewedBy).toBe('');
      expect(response.body.reviewedAt).toBe('');
      expect(response.body.createdBy).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing product', async () => {
      const response = await request(app)
        .get('/api/products/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Product not found');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/products/${productId}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/products/:productId/moderate', () => {
    it('should return 403 for current user not having permission to moderate products', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}/moderate`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to moderate products'
      );
    });

    it('should return 200 for current user having permission to moderate products', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}/moderate`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          status: 'approved',
        });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('New product by user');
      expect(response.body.status).toBe('approved');
      expect(response.body.reviewedBy).toBeDefined();
      expect(response.body.reviewedAt).toBeDefined();
      expect(response.body.createdBy).toBeDefined();
    });
  });

  describe('PATCH /api/products/:productId', () => {
    it('should return 200 for current user having permission to edit products (as user)', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`)
        .send({
          title: 'Updated Product Title',
          category: 'Computing',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', productId);
      expect(response.body.title).toBe('Updated Product Title');
      expect(response.body.category).toBe('Computing');
      expect(response.body.status).toBe('pending');
      expect(response.body.reviewedBy).toBe('');
      expect(response.body.reviewedAt).toBe('');
      expect(response.body.createdBy).toBeDefined();
    });

    it('should return 200 for current user having permission to edit products (as moderator)', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Updated Product Title',
          category: 'Computing',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', productId);
      expect(response.body.title).toBe('Updated Product Title');
      expect(response.body.category).toBe('Computing');
      expect(response.body.status).toBe('approved');
      expect(response.body.reviewedBy).toBeDefined();
      expect(response.body.reviewedAt).toBeDefined();
      expect(response.body.createdBy).toBeDefined();
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Tomato',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('This product already exists');
    });

    it('should return 403 for current user not having permission to edit products', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          title: 'Updated Product Title',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to edit this product'
      );
    });

    it('should return 404 for non-existing product update', async () => {
      const response = await request(app)
        .patch('/api/products/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Updated Product Title',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Product not found');
    });
  });

  describe('DELETE /api/products/:productId', () => {
    it('should return 403 for current user not having permission to delete products', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'You don`t have permission to delete this product'
      );
    });

    it('should return 200 for current user having permission to delete products', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing product deletion', async () => {
      const response = await request(app)
        .delete('/api/products/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Product not found');
    });
  });
});
