const { init } = require('../src/server');
const { closeRedis } = require('../config/redis-config');
const { closeFirebase } = require('../config/firebase-config');
const { sequelize } = require('../src/models');
const request = require('supertest');

describe('Login Test', () => {
  let testServer;
  let token;
  let userId;

  beforeAll(async () => {
    testServer = await init(true);
  });


  it('should generate an access token on successful login', async () => {
    const res = await request(testServer.listener)
      .post('/auth/login')
      .send(
        {
          username: 'admin',
          password: 'Test12345!',
          notification_token: '123'
        }
      )

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('error', false);
    expect(res.body).toHaveProperty('message', 'Login berhasil');
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
    userId = res.body.user_id;
  });

  it('should return invalid password on wrong password', async () => {
    const res = await request(testServer.listener)
      .post('/auth/login')
      .send(
        {
          username: 'admin',
          password: 'Test12345^',
          notification_token: '123'
        }
      )

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message', 'Password tidak sesuai');
  });

  it('should return user data', async () => {
    const res = await request(testServer.listener)
      .get(`/users/${userId}`)
      .set(
        {
          Authorization: `Bearer ${token}`,
        }
      )

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('error', false);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('email');
    expect(res.body.data).toHaveProperty('username');
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('type');
    expect(res.body.data).toHaveProperty('createdAt');
  });

  it('should return sensor configuration', async () => {
    const res = await request(testServer.listener)
      .get(`/configuration/temperature`)
      .set(
        {
          Authorization: `Bearer ${token}`,
        }
      )

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('error', false);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('min');
    expect(res.body.data).toHaveProperty('max');
    expect(res.body.data).toHaveProperty('status');
  });

  it('should return aerator configuration', async () => {
    const res = await request(testServer.listener)
      .get(`/configuration/actuator`)
      .set(
        {
          Authorization: `Bearer ${token}`,
        }
      )

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('error', false);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('feeder');
    expect(res.body.data).toHaveProperty('aerator');
  });

  it('should return history list', async () => {
    const res = await request(testServer.listener)
      .get(`/histories`)
      .set(
        {
          Authorization: `Bearer ${token}`,
        }
      )

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('error', false);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('histories');
    expect(res.body.data.histories.length).toBeGreaterThan(0);
  });

  it('should return success on successful logout', async () => {
    const res = await request(testServer.listener)
      .get('/auth/logout')
      .set(
        {
          Authorization: `Bearer ${token}`,
        }
      )

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('error', false);
    expect(res.body).toHaveProperty('message', 'Logout berhasil');
  });

  afterAll(async () => {
    await testServer.stop();
    await closeRedis();
    await closeFirebase();
    await sequelize.close();
  });
});