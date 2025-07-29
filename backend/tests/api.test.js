
const request = require('supertest');
const app = require('../server');

describe('API', () => {
  let token;
  beforeAll(async () => {
    const res = await request(app).post('/login').send({ email: 'test@test.com', password: '123456' });
    token = res.body.token;
  });

  it('Login - success', async () => {
    const res = await request(app).post('/login').send({ email: 'test@test.com', password: '123456' });
    expect(res.statusCode).toBe(200);
  });

  it('Login - failure', async () => {
    const res = await request(app).post('/login').send({ email: 'x@y.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });

  it('Create + Get todo', async () => {
    await request(app).post('/items').set('Authorization', `Bearer ${token}`).send({ title: 'Test' });
    const res = await request(app).get('/items').set('Authorization', `Bearer ${token}`);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
