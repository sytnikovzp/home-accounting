/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../app');
const { connectMongoDB, closeMongoDB } = require('../db/dbMongo');

beforeAll(connectMongoDB);
afterAll(closeMongoDB);

describe('AuthController', () => {
  let refreshToken = null;

  describe('POST /api/auth/registration', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/registration').send({
        fullName: 'Євген Ступка',
        email: 'nepushkin93@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Євген Ступка');
      expect(response.body.user.role).toBe('Users');
      expect(response.body.user).toHaveProperty('photo');
      refreshToken = response.body.refreshToken;
    });

    it('should return 400 for existing user', async () => {
      const response = await request(app).post('/api/auth/registration').send({
        email: 'i.petrenko@gmail.com',
        fullName: 'Іван Петренко',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Цей користувач вже зареєстрований');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'nepushkin93@gmail.com',
        password: 'Qwerty12',
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Євген Ступка');
      expect(response.body.user).toHaveProperty('emailConfirm');
      expect(response.body.user.role).toBe('Users');
      expect(response.body.user).toHaveProperty('photo');
      expect(response.body).toHaveProperty('permissions');
      refreshToken = response.body.refreshToken;
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'nepushkin93@gmail.com',
        password: 'Qwerty21',
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('GET /api/auth/refresh', () => {
    it('should refresh token', async () => {
      const response = await request(app)
        .get('/api/auth/refresh')
        .set('Cookie', `refreshToken=${refreshToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('uuid');
      expect(response.body.user.fullName).toBe('Євген Ступка');
      expect(response.body.user).toHaveProperty('emailConfirm');
      expect(response.body.user.role).toBe('Users');
      expect(response.body.user).toHaveProperty('photo');
      expect(response.body).toHaveProperty('permissions');
    });

    it('should return 401 if refresh token is missing', async () => {
      const response = await request(app).get('/api/auth/refresh');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Перевірте свої облікові дані');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Помилка авторизації');
    });
  });

  describe('GET /api/auth/logout', () => {
    it('should logout the user', async () => {
      const response = await request(app).get('/api/auth/logout');
      expect(response.status).toBe(200);
      expect(response.body).toBe('OK');
    });
  });

  describe('POST /api/auth/forgot', () => {
    it('should send password reset email to existing user', async () => {
      const response = await request(app).post('/api/auth/forgot').send({
        email: 'nepushkin93@gmail.com',
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'На Вашу електронну адресу відправлено повідомлення з подальшими інструкціями'
      );
      expect(response.body.severity).toBe('success');
      expect(response.body.title).toBe('Відновлення паролю');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).post('/api/auth/forgot').send({
        email: 'nepushkin@gmail.com',
      });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Користувача не знайдено');
      expect(response.body.severity).toBe('error');
      expect(response.body.title).toBe('Сталася помилка');
    });
  });
});
