import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  app,
  request,
  connectTestDB,
  disconnectTestDB,
  createTestUser,
  User,
} from './testHelper.js';

describe('User Profiles Integration Tests', () => {
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

  it('should fetch own profile via GET /api/users/me with valid Bearer token', async () => {
    const { user, authHeader } = await createTestUser();
    createdUserIds.push(user._id);

    const res = await request(app)
      .get('/api/users/me')
      .set(authHeader)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data.user.name).toBe(user.name);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should update profile fields via PATCH /api/users/me and persist sanitized changes', async () => {
    const { user, authHeader } = await createTestUser();
    createdUserIds.push(user._id);

    const updatePayload = {
      name: '  Alexandria Chen  ',
      college: '  MIT School of Engineering  ',
      department: '  Computer Science & AI  ',
      semester: 7,
      bio: '  Exploring neural networks and distributed systems.  ',
      skills: ['  Python  ', 'PyTorch', '  Go  '],
      interests: ['  Deep Learning  ', 'Systems Design'],
      availability: {
        weekdays: '  6:00 PM - 9:00 PM  ',
        weekends: '  10:00 AM - 4:00 PM  ',
        preferredTeamSize: '  2 to 4 peers  ',
        openTo: ['  Research  ', 'Hackathons'],
      },
      avatar: {
        url: '  https://images.unsplash.com/photo-sample  ',
      },
    };

    const res = await request(app)
      .patch('/api/users/me')
      .set(authHeader)
      .send(updatePayload)
      .expect(200);

    expect(res.body.success).toBe(true);
    const updated = res.body.data.user;
    expect(updated.name).toBe('Alexandria Chen');
    expect(updated.college).toBe('MIT School of Engineering');
    expect(updated.department).toBe('Computer Science & AI');
    expect(updated.semester).toBe(7);
    expect(updated.bio).toBe('Exploring neural networks and distributed systems.');
    expect(updated.skills).toEqual(['Python', 'PyTorch', 'Go']);
    expect(updated.interests).toEqual(['Deep Learning', 'Systems Design']);
    expect(updated.availability.weekdays).toBe('6:00 PM - 9:00 PM');
    expect(updated.avatar.url).toBe('https://images.unsplash.com/photo-sample');

    // Verify in database
    const dbUser = await User.findById(user._id);
    expect(dbUser.name).toBe('Alexandria Chen');
    expect(dbUser.semester).toBe(7);
  });

  it('should ignore attempts to update restricted fields like email, password, role, and _id', async () => {
    const { user, authHeader } = await createTestUser({ role: 'student' });
    createdUserIds.push(user._id);

    const restrictedPayload = {
      name: 'Legit New Name',
      email: 'hacked_email@malicious.com',
      password: 'HackedNewPassword999!',
      role: 'admin',
      _id: '60d0fe4f5311236168a109ca',
    };

    const res = await request(app)
      .patch('/api/users/me')
      .set(authHeader)
      .send(restrictedPayload)
      .expect(200);

    expect(res.body.success).toBe(true);
    const updated = res.body.data.user;
    expect(updated.name).toBe('Legit New Name');
    expect(updated.email).toBe(user.email);
    expect(updated.role).toBe('student');
    expect(updated._id.toString()).toBe(user._id.toString());

    // Verify password was not altered in DB
    const dbUser = await User.findById(user._id).select('+password');
    const isOriginalPasswordValid = await dbUser.comparePassword('Password123!');
    expect(isOriginalPasswordValid).toBe(true);
  });

  it('should reject invalid profile updates with 400 Bad Request', async () => {
    const { user, authHeader } = await createTestUser();
    createdUserIds.push(user._id);

    // Semester out of bounds (> 12)
    const badSemRes = await request(app)
      .patch('/api/users/me')
      .set(authHeader)
      .send({ semester: 15 })
      .expect(400);

    expect(badSemRes.body.success).toBe(false);
    expect(badSemRes.body.message).toMatch(/semester/i);

    // Name too short (< 2 chars)
    const badNameRes = await request(app)
      .patch('/api/users/me')
      .set(authHeader)
      .send({ name: 'A' })
      .expect(400);

    expect(badNameRes.body.success).toBe(false);
    expect(badNameRes.body.message).toMatch(/name/i);
  });
});

