import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  app,
  request,
  connectTestDB,
  disconnectTestDB,
  createTestUser,
  User,
} from './testHelper.js';

describe('Authentication Flow Integration Tests', () => {
  const createdUserIds = [];

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    if (createdUserIds.length > 0) {
      await User.deleteMany({ _id: { $in: createdUserIds } });
    }
    await disconnectTestDB();
  });

  it('should register a new user successfully with 201 status and return JWT and safe user object', async () => {
    const unique = `reg_${Date.now()}`;
    const payload = {
      name: 'Auth Tester',
      email: `${unique}@example.com`,
      password: 'Password123!',
      college: 'Global Tech Institute',
      department: 'Computer Science',
      semester: 4,
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(payload)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user.email).toBe(payload.email.toLowerCase());
    expect(res.body.data.user.name).toBe(payload.name);
    expect(res.body.data.user.password).toBeUndefined();

    if (res.body.data.user._id) {
      createdUserIds.push(res.body.data.user._id);
    }
  });

  it('should reject registration when email is already registered with 409 conflict', async () => {
    const { user } = await createTestUser();
    createdUserIds.push(user._id);

    const duplicatePayload = {
      name: 'Duplicate Candidate',
      email: user.email,
      password: 'AnotherPassword123!',
      college: 'Global Tech Institute',
      department: 'Computer Science',
      semester: 4,
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(duplicatePayload)
      .expect(409);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should login successfully with valid credentials and return JWT token', async () => {
    const uniqueEmail = `login_${Date.now()}@example.com`;
    const password = 'CorrectPassword123!';
    const { user } = await createTestUser({ email: uniqueEmail, password });
    createdUserIds.push(user._id);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: uniqueEmail, password })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(uniqueEmail);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should reject login with invalid password with 401 status', async () => {
    const uniqueEmail = `badpass_${Date.now()}@example.com`;
    const { user } = await createTestUser({ email: uniqueEmail, password: 'RealPassword123!' });
    createdUserIds.push(user._id);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: uniqueEmail, password: 'WrongPassword999!' })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it('should reject login with non-existent email with 401 status', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: `nonexistent_${Date.now()}@example.com`, password: 'Password123!' })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it('should fetch own user profile using protected /api/auth/me with valid Bearer token', async () => {
    const { user, authHeader } = await createTestUser();
    createdUserIds.push(user._id);

    const res = await request(app)
      .get('/api/auth/me')
      .set(authHeader)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should reject protected /api/auth/me without token with 401 status', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/token|denied|authorized/i);
  });

  it('should reject protected /api/auth/me with invalid or malformed JWT with 401 status', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.jwt.signature_here')
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not authorized|invalid/i);
  });
});
