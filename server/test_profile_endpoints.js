import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import mongoose from 'mongoose';
import app from './server.js';
import User from './models/User.js';

let server;

async function runTests() {
  console.log('--- Starting Phase 2 Profile Endpoint Tests ---');

  // Connect to DB if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  // Start HTTP server on a random port
  const port = 5001;
  server = app.listen(port);
  const baseUrl = `http://localhost:${port}/api`;

  let testUserToken = '';
  let testUserId = '';
  const testEmail = `test_profile_${Date.now()}@example.com`;
  const originalPassword = 'Password123!';

  try {
    // 1. Test GET /api/users/me returns 401 without token
    console.log('\n[Test 1] GET /api/users/me without Bearer token...');
    const noTokenRes = await fetch(`${baseUrl}/users/me`);
    const noTokenData = await noTokenRes.json();
    if (noTokenRes.status === 401 && noTokenData.success === false) {
      console.log('✅ PASS: Returned 401 Unauthorized without token.');
    } else {
      throw new Error(`FAIL: Expected 401, got ${noTokenRes.status}`);
    }

    // 2. Register test user to obtain valid JWT
    console.log('\n[Setup] Registering test user...');
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Profile Tester',
        email: testEmail,
        password: originalPassword,
        college: 'Test College of Engineering',
        department: 'Computer Science',
        semester: 6,
      }),
    });
    const regData = await regRes.json();
    if (regRes.status !== 201 || !regData.data?.token) {
      throw new Error(`Failed to register test user: ${JSON.stringify(regData)}`);
    }
    testUserToken = regData.data.token;
    testUserId = regData.data.user._id || regData.data.user.id;
    console.log(`✅ Test user registered with ID: ${testUserId}`);

    // 3. Test GET /api/users/me with valid token
    console.log('\n[Test 2] GET /api/users/me with valid token...');
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${testUserToken}`,
    };

    const getMeRes = await fetch(`${baseUrl}/users/me`, { headers: authHeaders });
    const getMeData = await getMeRes.json();
    if (
      getMeRes.status === 200 &&
      getMeData.success === true &&
      getMeData.data?.user?.email === testEmail &&
      getMeData.data?.user?.password === undefined
    ) {
      console.log('✅ PASS: Profile fetched successfully with safe user object.');
    } else {
      throw new Error(`FAIL: ${JSON.stringify(getMeData)}`);
    }

    // 4. Test PATCH /api/users/me updates profile fields in MongoDB
    console.log('\n[Test 3] PATCH /api/users/me persists changes in MongoDB...');
    const updatePayload = {
      name: '  Updated Tester Name  ',
      college: '  Apex Institute of Technology  ',
      department: '  Information Science  ',
      semester: 7,
      bio: '  Full stack developer with passion for distributed systems.  ',
      skills: ['  React  ', 'Node.js', '  TypeScript  ', '  ', 'MongoDB'],
      interests: ['  AI/ML  ', 'Cloud Architecture', ''],
      availability: {
        weekdays: '  7:00 PM - 10:00 PM  ',
        weekends: '  10:00 AM - 6:00 PM  ',
        preferredTeamSize: '  3 to 4 peers  ',
        openTo: ['  Hackathons  ', '', 'Research Papers'],
      },
      avatar: {
        url: '  https://images.unsplash.com/photo-test  ',
      },
    };

    const patchRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify(updatePayload),
    });
    const patchData = await patchRes.json();

    if (patchRes.status !== 200 || !patchData.success) {
      throw new Error(`FAIL: Update failed: ${JSON.stringify(patchData)}`);
    }

    const u = patchData.data.user;
    if (
      u.name === 'Updated Tester Name' &&
      u.college === 'Apex Institute of Technology' &&
      u.department === 'Information Science' &&
      u.semester === 7 &&
      u.bio === 'Full stack developer with passion for distributed systems.' &&
      JSON.stringify(u.skills) === JSON.stringify(['React', 'Node.js', 'TypeScript', 'MongoDB']) &&
      JSON.stringify(u.interests) === JSON.stringify(['AI/ML', 'Cloud Architecture']) &&
      u.availability.weekdays === '7:00 PM - 10:00 PM' &&
      u.availability.weekends === '10:00 AM - 6:00 PM' &&
      u.availability.preferredTeamSize === '3 to 4 peers' &&
      JSON.stringify(u.availability.openTo) === JSON.stringify(['Hackathons', 'Research Papers']) &&
      u.avatar.url === 'https://images.unsplash.com/photo-test' &&
      u.initials === 'UT'
    ) {
      console.log('✅ PASS: PATCH persisted and returned trimmed, sanitized updates.');
    } else {
      throw new Error(`FAIL: Mismatch in updated data: ${JSON.stringify(u)}`);
    }

    // 5. Test Refresh: GET /api/users/me verifies data retention
    console.log('\n[Test 4] Refresh check: Re-fetch GET /api/users/me directly from DB...');
    const refreshRes = await fetch(`${baseUrl}/users/me`, { headers: authHeaders });
    const refreshData = await refreshRes.json();
    const ru = refreshData.data.user;
    if (
      ru.name === 'Updated Tester Name' &&
      ru.semester === 7 &&
      ru.skills.includes('TypeScript') &&
      ru.availability.openTo.includes('Hackathons')
    ) {
      console.log('✅ PASS: Refresh retains persisted changes in MongoDB.');
    } else {
      throw new Error(`FAIL: Refresh did not return updated fields: ${JSON.stringify(ru)}`);
    }

    // 6. Test attempts to update email, password, role, _id are ignored/rejected
    console.log('\n[Test 5] Attempting to update email, password, role, _id...');
    const maliciousPayload = {
      email: 'hacker@malicious.com',
      password: 'HackedPassword999!',
      role: 'admin',
      _id: '60d0fe4f5311236168a109ca',
      name: 'Legit Tester Name',
    };

    const disallowRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify(maliciousPayload),
    });
    const disallowData = await disallowRes.json();
    const du = disallowData.data?.user;

    // Direct check in MongoDB
    const dbUser = await User.findById(testUserId).select('+password');
    const passwordStillOriginal = await dbUser.comparePassword(originalPassword);

    if (
      du.email === testEmail &&
      du.role === 'student' &&
      du._id.toString() === testUserId &&
      passwordStillOriginal === true
    ) {
      console.log('✅ PASS: Attempts to update email, password, role, and _id were strictly ignored.');
    } else {
      throw new Error(
        `FAIL: Protected fields were altered! Email: ${du.email}, Role: ${du.role}`
      );
    }

    // 7. Validation error tests
    console.log('\n[Test 6] Validation error checks...');

    // a. Semester > 12
    const badSemRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ semester: 15 }),
    });
    const badSemData = await badSemRes.json();
    if (badSemRes.status === 400 && badSemData.message.includes('Semester')) {
      console.log('✅ PASS: Semester > 12 rejected with readable 400 error.');
    } else {
      throw new Error(`FAIL: Bad semester was not rejected: ${JSON.stringify(badSemData)}`);
    }

    // b. Bio > 500 characters
    const longBio = 'a'.repeat(501);
    const badBioRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ bio: longBio }),
    });
    const badBioData = await badBioRes.json();
    if (badBioRes.status === 400 && badBioData.message.includes('500 characters')) {
      console.log('✅ PASS: Bio > 500 chars rejected with readable 400 error.');
    } else {
      throw new Error(`FAIL: Long bio was not rejected: ${JSON.stringify(badBioData)}`);
    }

    // c. Skills not an array of strings
    const badSkillsRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ skills: 'React, Node' }),
    });
    const badSkillsData = await badSkillsRes.json();
    if (badSkillsRes.status === 400 && badSkillsData.message.includes('array of strings')) {
      console.log('✅ PASS: Non-array skills rejected with readable 400 error.');
    } else {
      throw new Error(`FAIL: Invalid skills not rejected: ${JSON.stringify(badSkillsData)}`);
    }

    // 8. Test GET /api/users/:id
    console.log('\n[Test 7] GET /api/users/:id endpoint...');
    const peerRes = await fetch(`${baseUrl}/users/${testUserId}`, { headers: authHeaders });
    const peerData = await peerRes.json();
    if (
      peerRes.status === 200 &&
      peerData.success === true &&
      peerData.data?.user?.name === 'Legit Tester Name' &&
      peerData.data?.user?.password === undefined
    ) {
      console.log('✅ PASS: GET /api/users/:id returned safe public profile.');
    } else {
      throw new Error(`FAIL: GET /api/users/:id failed: ${JSON.stringify(peerData)}`);
    }

    // 404 on non-existent user
    const fakeId = new mongoose.Types.ObjectId().toString();
    const notFoundRes = await fetch(`${baseUrl}/users/${fakeId}`, { headers: authHeaders });
    if (notFoundRes.status === 404) {
      console.log('✅ PASS: GET /api/users/:id returned 404 for non-existent student.');
    } else {
      throw new Error(`FAIL: Expected 404, got ${notFoundRes.status}`);
    }

    console.log('\n🎉 ALL BACKEND ENDPOINT TESTS PASSED SUCCESSFULLY!');
  } finally {
    // Cleanup test user
    if (testUserId) {
      await User.findByIdAndDelete(testUserId);
      console.log(`[Cleanup] Removed test user ${testUserId} from MongoDB.`);
    }
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
  }
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Test Error:', err);
    process.exit(1);
  });
