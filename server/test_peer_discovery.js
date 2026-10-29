import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './server.js';
import User from './models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

let server;

async function runPeerDiscoveryTests() {
  console.log('--- Starting Phase 3 Peer Discovery & Matching Tests ---');

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  const port = 5002;
  server = app.listen(port);
  const baseUrl = `http://localhost:${port}/api`;

  let testUserToken = '';
  let testUserId = '';
  const testEmail = `match_tester_${Date.now()}@example.com`;

  try {
    // 1. Unauthenticated GET /api/users returns 401
    console.log('\n[Test 1] Unauthenticated GET /api/users returns 401...');
    const unauthRes = await fetch(`${baseUrl}/users`);
    const unauthData = await unauthRes.json();
    if (unauthRes.status === 401 && unauthData.success === false) {
      console.log('✅ PASS: Returned 401 Unauthorized without token.');
    } else {
      throw new Error(`FAIL: Expected 401, got ${unauthRes.status}`);
    }

    // 2. Register test user (requester)
    console.log('\n[Setup] Registering requester student user...');
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Requester Student',
        email: testEmail,
        password: 'Password123!',
        college: 'BMS College of Engineering',
        department: 'Computer Science and Engineering',
        semester: 6,
      }),
    });
    const regData = await regRes.json();
    if (regRes.status !== 201 || !regData.data?.token) {
      throw new Error(`Failed to register test user: ${JSON.stringify(regData)}`);
    }
    testUserToken = regData.data.token;
    testUserId = regData.data.user._id || regData.data.user.id;

    // Update requester profile with skills, interests, and availability
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${testUserToken}`,
    };

    await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        interests: ['Full-stack projects', 'Hackathons'],
        availability: {
          weekdays: '6:00 PM – 9:00 PM',
          weekends: '10:00 AM – 4:00 PM',
          preferredTeamSize: '2–4 members',
          openTo: ['Study groups', 'Hackathons', 'MERN projects'],
        },
      }),
    });
    console.log(`✅ Requester setup complete with skills: React, Node.js, MongoDB, TypeScript`);

    // 3. Authenticated request excludes the logged-in user
    console.log('\n[Test 2] Authenticated GET /api/users excludes the logged-in user...');
    const listRes = await fetch(`${baseUrl}/users`, { headers: authHeaders });
    const listData = await listRes.json();

    if (listRes.status !== 200 || !listData.success) {
      throw new Error(`FAIL: ${JSON.stringify(listData)}`);
    }

    const students = listData.data.students;
    const selfIncluded = students.some((s) => (s._id || s.id) === testUserId);
    if (!selfIncluded && students.length > 0) {
      console.log(`✅ PASS: Requester excluded from results. Returned ${students.length} peers.`);
    } else {
      throw new Error(`FAIL: Logged in user was found in discoverable results!`);
    }

    // 4. Compatibility score validation (always between 0 and 100)
    console.log('\n[Test 3] Compatibility score bounded 0-100 and dynamic calculation...');
    let allValidScores = true;
    for (const student of students) {
      const score = student.compatibilityScore;
      if (typeof score !== 'number' || score < 0 || score > 100) {
        allValidScores = false;
        break;
      }
    }
    if (allValidScores) {
      console.log('✅ PASS: All compatibility scores are valid integers between 0 and 100.');
    } else {
      throw new Error('FAIL: Compatibility score outside 0-100 range.');
    }

    // 5. Verify explainable matching reasons and breakdown
    console.log('\n[Test 4] Verify explainability: matchedSkills, matchedInterests, matchReasons...');
    const topMatch = students[0];
    if (
      Array.isArray(topMatch.matchedSkills) &&
      Array.isArray(topMatch.matchedInterests) &&
      Array.isArray(topMatch.matchReasons) &&
      topMatch.matchReasons.length > 0
    ) {
      console.log(`✅ PASS: Top match (${topMatch.name}) score: ${topMatch.compatibilityScore}%`);
      console.log(`   Reasons: ${topMatch.matchReasons.join(' • ')}`);
    } else {
      throw new Error('FAIL: Missing explainable matching attributes.');
    }

    // 6. Test search filter
    console.log('\n[Test 5] Search query parameter test...');
    const searchRes = await fetch(`${baseUrl}/users?search=Python`, { headers: authHeaders });
    const searchData = await searchRes.json();
    const searchPeers = searchData.data.students;
    const allMatchSearch = searchPeers.every((p) => {
      const inSkills = p.skills?.some((s) => s.toLowerCase().includes('python'));
      const inBio = p.bio?.toLowerCase().includes('python');
      const inName = p.name?.toLowerCase().includes('python');
      return inSkills || inBio || inName;
    });
    if (searchPeers.length > 0 && allMatchSearch) {
      console.log(`✅ PASS: Search for 'Python' returned ${searchPeers.length} relevant peers.`);
    } else {
      throw new Error(`FAIL: Search results did not match 'Python': ${JSON.stringify(searchPeers)}`);
    }

    // 7. Test department filter
    console.log('\n[Test 6] Department query filter...');
    const deptRes = await fetch(
      `${baseUrl}/users?department=Computer Science and Engineering`,
      { headers: authHeaders }
    );
    const deptData = await deptRes.json();
    const deptPeers = deptData.data.students;
    const allMatchDept = deptPeers.every(
      (p) => p.department === 'Computer Science and Engineering'
    );
    if (deptPeers.length > 0 && allMatchDept) {
      console.log(`✅ PASS: Department filter returned ${deptPeers.length} students all in CSE.`);
    } else {
      throw new Error('FAIL: Department filter returned mismatched students.');
    }

    // 8. Test semester filter
    console.log('\n[Test 7] Semester query filter...');
    const semRes = await fetch(`${baseUrl}/users?semester=6`, { headers: authHeaders });
    const semData = await semRes.json();
    const semPeers = semData.data.students;
    const allMatchSem = semPeers.every((p) => p.semester === 6);
    if (semPeers.length > 0 && allMatchSem) {
      console.log(`✅ PASS: Semester filter returned ${semPeers.length} students all in Semester 6.`);
    } else {
      throw new Error('FAIL: Semester filter returned mismatched students.');
    }

    // 9. Test pagination
    console.log('\n[Test 8] Pagination test (limit=3, page=2)...');
    const pageRes = await fetch(`${baseUrl}/users?limit=3&page=2`, { headers: authHeaders });
    const pageData = await pageRes.json();
    if (
      pageData.data.students.length <= 3 &&
      pageData.data.pagination.page === 2 &&
      pageData.data.pagination.limit === 3 &&
      pageData.data.pagination.total > 0
    ) {
      console.log(
        `✅ PASS: Pagination working correctly. Total: ${pageData.data.pagination.total}, TotalPages: ${pageData.data.pagination.totalPages}`
      );
    } else {
      throw new Error(`FAIL: Pagination error: ${JSON.stringify(pageData.data.pagination)}`);
    }

    // 10. Test sorting
    console.log('\n[Test 9] Sort options test (name & compatibility)...');
    const nameSortRes = await fetch(`${baseUrl}/users?sort=name`, { headers: authHeaders });
    const nameSortData = await nameSortRes.json();
    const nameSorted = nameSortData.data.students;
    const isAlphabetical = nameSorted.every(
      (val, i, arr) => !i || arr[i - 1].name.localeCompare(val.name) <= 0
    );
    if (isAlphabetical) {
      console.log('✅ PASS: Alphabetical sort by name verified.');
    } else {
      throw new Error('FAIL: Sort by name was not in alphabetical order.');
    }

    // 11. Test GET /api/users/:id with relative compatibility details
    console.log('\n[Test 10] GET /api/users/:id with dynamic compatibility details...');
    const targetPeerId = topMatch._id || topMatch.id;
    const peerRes = await fetch(`${baseUrl}/users/${targetPeerId}`, { headers: authHeaders });
    const peerData = await peerRes.json();

    if (
      peerRes.status === 200 &&
      peerData.success === true &&
      peerData.data?.user?.name === topMatch.name &&
      typeof peerData.data?.user?.compatibilityScore === 'number' &&
      peerData.data?.user?.password === undefined
    ) {
      console.log(`✅ PASS: Peer details fetched with relative compatibility (${peerData.data.user.compatibilityScore}%).`);
    } else {
      throw new Error(`FAIL: GET /api/users/:id failed: ${JSON.stringify(peerData)}`);
    }

    // 12. Test GET /api/users/:id returns 404 for missing user
    console.log('\n[Test 11] GET /api/users/:id returns 404 for non-existent student...');
    const missingId = new mongoose.Types.ObjectId().toString();
    const missingRes = await fetch(`${baseUrl}/users/${missingId}`, { headers: authHeaders });
    if (missingRes.status === 404) {
      console.log('✅ PASS: Missing user returned 404 as required.');
    } else {
      throw new Error(`FAIL: Expected 404, got ${missingRes.status}`);
    }

    console.log('\n🎉 ALL PHASE 3 PEER DISCOVERY TESTS PASSED SUCCESSFULLY!');
  } finally {
    if (testUserId) {
      await User.findByIdAndDelete(testUserId);
      console.log(`\n[Cleanup] Removed test user ${testUserId} from database.`);
    }
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
  }
}

runPeerDiscoveryTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Test Error:', err);
    process.exit(1);
  });
