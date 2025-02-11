/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../app');

const { initializeDatabase, closeDatabase } = require('../utils/seedMongo');

beforeAll(initializeDatabase);
afterAll(closeDatabase);

const authData = {
  admin: { accessToken: null, uuid: null },
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
      authData.admin.uuid = response.body.user.uuid;
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
      expect(response.body.errors[0].title).toBe(
        'Ця одиниця вимірів вже існує'
      );
    });

    it('should return 403 for current user not having permission to create measures', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          description: '',
          title: 'Нова одиниця вимірів',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на додавання одиниць вимірів'
      );
    });

    it('should return 400 for missing measure title', async () => {
      const response = await request(app)
        .post('/api/measures')
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          description: 'Відсутня назва',
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0].title).toBe('Validation Error');
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
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existing measure', async () => {
      const response = await request(app)
        .get('/api/measures/999')
        .set('Authorization', `Bearer ${authData.user.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Одиницю вимірів не знайдено');
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
      expect(response.body.errors[0].title).toBe(
        'Ця одиниця вимірів вже існує'
      );
    });

    it('should return 403 for current user not having permission to edit measures', async () => {
      const response = await request(app)
        .patch(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`)
        .send({
          description: 'Оновлений опис одиниці вимірів',
          title: 'Оновлена назва одиниці вимірів',
        });
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на редагування цієї одиниці вимірів'
      );
    });

    it('should return 404 for non-existing measure update', async () => {
      const response = await request(app)
        .patch('/api/measures/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`)
        .send({
          title: 'Оновлена назва одиниці вимірів',
        });
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Одиницю вимірів не знайдено');
    });
  });

  describe('DELETE /api/measures/:measureUuid', () => {
    it('should return 403 for current user not having permission to delete measures', async () => {
      const response = await request(app)
        .delete(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.admin.accessToken}`);
      expect(response.status).toBe(403);
      expect(response.body.errors[0].title).toBe(
        'Ви не маєте дозволу на видалення цієї одиниці вимірів'
      );
    });

    it('should return 200 for current user having permission to delete measures', async () => {
      const response = await request(app)
        .delete(`/api/measures/${measureUuid}`)
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existing measure deletion', async () => {
      const response = await request(app)
        .delete('/api/measures/999')
        .set('Authorization', `Bearer ${authData.moderator.accessToken}`);
      expect(response.status).toBe(404);
      expect(response.body.errors[0].title).toBe('Одиницю вимірів не знайдено');
    });
  });
});
