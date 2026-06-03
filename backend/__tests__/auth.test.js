const request = require('supertest');
const app = require('../server');
const db = require('../test-setup');
const User = require('../src/models/User');

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecretkey987654321';
  await db.connect();
});

afterAll(async () => {
  await db.close();
});

beforeEach(async () => {
  await db.clear();
});

describe('Auth Endpoints', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('john@example.com');
  });

  it('should fail registration with invalid input validation rules', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: '',
        email: 'notanemail',
        password: '123'
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should login an existing user and return a token', async () => {
    await User.create({
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'affiliate'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'sarah@example.com',
        password: 'password123'
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('should fail login with wrong credentials', async () => {
    await User.create({
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'affiliate'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'sarah@example.com',
        password: 'wrongpassword'
      });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
