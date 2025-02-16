/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../app');
const { connectMongoDB, closeMongoDB } = require('../db/dbMongo');

beforeAll(connectMongoDB);
afterAll(closeMongoDB);

const authData = {
  administrator: { accessToken: null, uuid: null },
  moderator: { accessToken: null, uuid: null },
  user: { accessToken: null, uuid: null },
};

describe('MeasuresController', () => {
  let measureUuid = null;

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'hanna.shevchenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Ганна Шевченко');
      expect(response.body.user.role).toBe('Users');
      authData.user.uuid = response.body.user.uuid;
      authData.user.accessToken = response.body.accessToken;
    });

    it('should login an existing moderator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'o.ivanchuk@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Олександра Іванчук');
      expect(response.body.user.role).toBe('Moderators');
      authData.moderator.uuid = response.body.user.uuid;
      authData.moderator.accessToken = response.body.accessToken;
    });

    it('should login an existing administrator', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'ivan.petrenko@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Іван Петренко');
      expect(response.body.user.role).toBe('Administrators');
      authData.administrator.uuid = response.body.user.uuid;
      authData.administrator.accessToken = response.body.accessToken;
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
        .query({ limit: 10, page: 1 })
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
          description: '',
          title: 'Нова одиниця вимірів',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.title).toBe('Нова одиниця вимірів');
      expect(response.body.description).toBe('');
      measureUuid = response.body.uuid;
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Нова одиниця вимірів',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to create measures', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          description: '',
          title: 'Нова одиниця вимірів',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 400 for missing measure title', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          description: 'Відсутня назва',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('GET /api/measures/:measureUuid', () => {
    it('should get measure by id', async () => {
      const response = await request(app)
        .get(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', measureUuid);
      expect(response.body.title).toBe('Нова одиниця вимірів');
      expect(response.body.description).toBe('');
      expect(response.body.creation.createdAt).toBeDefined();
      expect(response.body.creation.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing measure', async () => {
      const response = await request(app)
        .get('/api/measures/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 401 if access token is missing', async () => {
      const response = await request(app).get(`/api/measures/${measureUuid}`);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/measures/:measureUuid', () => {
    it('should return 200 for current user having permission to edit measures', async () => {
      const response = await request(app)
        .patch(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          description: 'Оновлений опис одиниці вимірів',
          title: 'Оновлена назва одиниці вимірів',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uuid', measureUuid);
      expect(response.body.title).toBe('Оновлена назва одиниці вимірів');
      expect(response.body.description).toBe('Оновлений опис одиниці вимірів');
    });

    it('should return 400 if an element with that title already exists', async () => {
      const response = await request(app)
        .patch(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'кг',
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 403 for current user not having permission to edit measures', async () => {
      const response = await request(app)
        .patch(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`)
        .send({
          description: 'Оновлений опис одиниці вимірів',
          title: 'Оновлена назва одиниці вимірів',
        });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 404 for non-existing measure update', async () => {
      const response = await request(app)
        .patch('/api/measures/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва одиниці вимірів',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('DELETE /api/measures/:measureUuid', () => {
    it('should return 403 for current user not having permission to delete measures', async () => {
      const response = await request(app)
        .delete(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.administrator.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });

    it('should return 200 for current user having permission to delete measures', async () => {
      const response = await request(app)
        .delete(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing measure deletion', async () => {
      const response = await request(app)
        .delete('/api/measures/83095a11-50b6-4a01-859e-94f7f4b62cc1')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Помилка');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });
});
