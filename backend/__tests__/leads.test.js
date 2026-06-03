const request = require('supertest');
const app = require('../server');
const db = require('../test-setup');
const User = require('../src/models/User');
const Lead = require('../src/models/Lead');
const jwt = require('jsonwebtoken');

let adminToken, affiliateToken, adminUser, affiliateUser;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecretkey987654321';
  await db.connect();
});

afterAll(async () => {
  await db.close();
});

beforeEach(async () => {
  await db.clear();

  adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  });

  affiliateUser = await User.create({
    name: 'Affiliate User',
    email: 'affiliate@test.com',
    password: 'password123',
    role: 'affiliate'
  });

  adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  affiliateToken = jwt.sign({ id: affiliateUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
});

describe('Leads Endpoints', () => {
  it('should block unauthenticated requests', async () => {
    const res = await request(app).get('/api/leads');
    expect(res.status).toBe(401);
  });

  it('should allow authenticated users to list leads', async () => {
    const res = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${affiliateToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.pagination).toBeDefined();
  });

  it('should create a lead successfully with valid details', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${affiliateToken}`)
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '1234567890',
        company: 'Widgets Inc',
        source: 'Website',
        value: 500
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Jane Doe');
    expect(res.body.data.assignedAffiliate._id).toBe(affiliateUser._id.toString());
  });

  it('should fail lead creation on validation errors', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${affiliateToken}`)
      .send({
        name: '',
        email: 'invalid-email'
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should allow admin to export leads to CSV', async () => {
    await Lead.create({
      name: 'Sample Lead',
      email: 'sample@example.com',
      createdBy: adminUser._id
    });

    const res = await request(app)
      .post('/api/leads/export')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
  });

  it('should deny non-admin users from exporting leads', async () => {
    const res = await request(app)
      .post('/api/leads/export')
      .set('Authorization', `Bearer ${affiliateToken}`);
    expect(res.status).toBe(403);
  });
});
