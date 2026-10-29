import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './server.js';
import User from './models/User.js';
import StudyGroup from './models/StudyGroup.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

let server;

async function runStudyGroupTests() {
  console.log('--- Starting Phase 4 Study Groups Backend Verification Tests ---');

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  const port = 5003;
  server = app.listen(port);
  const baseUrl = `http://localhost:${port}/api`;

  let ownerToken = '';
  let ownerUser = null;
  let otherToken = '';
  let otherUser = null;
  let createdGroupId = '';

  const ownerEmail = `sg_owner_${Date.now()}@example.com`;
  const otherEmail = `sg_other_${Date.now()}@example.com`;

  try {
    // 1. Unauthorized requests return 401
    console.log('\n[Test 1] Unauthorized requests return 401...');
    const unauthRes = await fetch(`${baseUrl}/study-groups`);
    const unauthData = await unauthRes.json();
    if (unauthRes.status === 401 && unauthData.success === false) {
      console.log('✅ PASS: GET /api/study-groups returned 401 without auth token.');
    } else {
      throw new Error(`FAIL: Expected 401, got ${unauthRes.status}: ${JSON.stringify(unauthData)}`);
    }

    const unauthPostRes = await fetch(`${baseUrl}/study-groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Unauthorized Group', subject: 'CS', description: 'Test', maxMembers: 5 }),
    });
    if (unauthPostRes.status === 401) {
      console.log('✅ PASS: POST /api/study-groups returned 401 without auth token.');
    } else {
      throw new Error(`FAIL: Expected 401, got ${unauthPostRes.status}`);
    }

    // Register 2 test users (Owner and Other Student)
    console.log('\n[Setup] Registering Owner and Secondary student users...');
    const regOwner = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Owner Student',
        email: ownerEmail,
        password: 'Password123!',
        college: 'BMS College of Engineering',
        department: 'Computer Science and Engineering',
        semester: 6,
      }),
    });
    const regOwnerData = await regOwner.json();
    ownerToken = regOwnerData.data?.token;
    ownerUser = regOwnerData.data?.user;

    const regOther = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Peer Collaborator',
        email: otherEmail,
        password: 'Password123!',
        college: 'RV College of Engineering',
        department: 'Artificial Intelligence & Data Science',
        semester: 6,
      }),
    });
    const regOtherData = await regOther.json();
    otherToken = regOtherData.data?.token;
    otherUser = regOtherData.data?.user;

    console.log(`✅ Registered owner (${ownerUser.name}) and peer (${otherUser.name})`);

    const ownerHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ownerToken}`,
    };
    const otherHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${otherToken}`,
    };

    // 2. Create group assigns creator as owner & first member automatically
    console.log('\n[Test 2] POST /api/study-groups creates group and assigns creator as owner...');
    const createRes = await fetch(`${baseUrl}/study-groups`, {
      method: 'POST',
      headers: ownerHeaders,
      body: JSON.stringify({
        name: 'Distributed Systems Study Circle',
        description: 'Exploring consensus algorithms (Raft, Paxos), vector clocks, and distributed transactions.',
        subject: 'Computer Science',
        topics: ['Distributed Systems', 'Consensus', 'Raft'],
        level: 'intermediate',
        meetingMode: 'online',
        schedule: {
          days: ['Tuesday', 'Thursday'],
          time: '7:00 PM',
          timezone: 'IST',
        },
        maxMembers: 3, // Capacity of 3 for testing full groups later
      }),
    });
    const createData = await createRes.json();
    if (createRes.status === 201 && createData.success === true) {
      createdGroupId = createData.data.group.id;
      const grp = createData.data.group;
      if (
        grp.isOwner === true &&
        grp.memberCount === 1 &&
        grp.members[0].role === 'owner' &&
        grp.members[0].id === (ownerUser._id || ownerUser.id).toString()
      ) {
        console.log(`✅ PASS: Group created with ID ${createdGroupId}. Owner is creator and first member.`);
      } else {
        throw new Error(`FAIL: Creator not properly assigned as owner. Response: ${JSON.stringify(grp)}`);
      }
    } else {
      throw new Error(`FAIL: Expected 201 Created, got ${createRes.status}: ${JSON.stringify(createData)}`);
    }

    // 3. User can join a group
    console.log('\n[Test 3] POST /api/study-groups/:id/join allows a peer to join...');
    const joinRes = await fetch(`${baseUrl}/study-groups/${createdGroupId}/join`, {
      method: 'POST',
      headers: otherHeaders,
    });
    const joinData = await joinRes.json();
    if (joinRes.status === 200 && joinData.data.group.memberCount === 2) {
      console.log('✅ PASS: Peer successfully joined group. Member count is now 2.');
    } else {
      throw new Error(`FAIL: Expected 200, got ${joinRes.status}: ${JSON.stringify(joinData)}`);
    }

    // 4. Duplicate membership rejected
    console.log('\n[Test 4] Duplicate join request returns 400...');
    const dupJoinRes = await fetch(`${baseUrl}/study-groups/${createdGroupId}/join`, {
      method: 'POST',
      headers: otherHeaders,
    });
    const dupJoinData = await dupJoinRes.json();
    if (dupJoinRes.status === 400 && dupJoinData.success === false) {
      console.log(`✅ PASS: Rejected duplicate join with message: "${dupJoinData.message}"`);
    } else {
      throw new Error(`FAIL: Expected 400 for duplicate join, got ${dupJoinRes.status}`);
    }

    // 5. Full group rejects new members
    console.log('\n[Test 5] Group at capacity rejects new members (400)...');
    // Register 3rd member to fill the group (maxMembers = 3)
    const thirdEmail = `sg_third_${Date.now()}@example.com`;
    const regThird = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Third Student',
        email: thirdEmail,
        password: 'Password123!',
        college: 'BMS College of Engineering',
        department: 'Information Science and Engineering',
        semester: 6,
      }),
    });
    const regThirdData = await regThird.json();
    const thirdToken = regThirdData.data?.token;

    // Join 3rd member -> group now has 3/3 members (FULL)
    await fetch(`${baseUrl}/study-groups/${createdGroupId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${thirdToken}`,
      },
    });

    // Register 4th member and attempt to join full group
    const fourthEmail = `sg_fourth_${Date.now()}@example.com`;
    const regFourth = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Fourth Student',
        email: fourthEmail,
        password: 'Password123!',
        college: 'PES University',
        department: 'Computer Science and Engineering',
        semester: 6,
      }),
    });
    const regFourthData = await regFourth.json();
    const fourthToken = regFourthData.data?.token;

    const fullJoinRes = await fetch(`${baseUrl}/study-groups/${createdGroupId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${fourthToken}`,
      },
    });
    const fullJoinData = await fullJoinRes.json();
    if (fullJoinRes.status === 400 && fullJoinData.success === false) {
      console.log(`✅ PASS: Full group rejected new member with message: "${fullJoinData.message}"`);
    } else {
      throw new Error(`FAIL: Expected 400 when group is full, got ${fullJoinRes.status}: ${JSON.stringify(fullJoinData)}`);
    }

    // 6. Owner cannot leave group without transferring ownership
    console.log('\n[Test 6] Group owner cannot leave group (400)...');
    const ownerLeaveRes = await fetch(`${baseUrl}/study-groups/${createdGroupId}/leave`, {
      method: 'POST',
      headers: ownerHeaders,
    });
    const ownerLeaveData = await ownerLeaveRes.json();
    if (ownerLeaveRes.status === 400 && ownerLeaveData.success === false) {
      console.log(`✅ PASS: Owner leave rejected with message: "${ownerLeaveData.message}"`);
    } else {
      throw new Error(`FAIL: Expected 400 for owner leaving, got ${ownerLeaveRes.status}`);
    }

    // 7. Non-owner can edit? Must return 403 Forbidden
    console.log('\n[Test 7] Non-owner updating group returns 403 Forbidden...');
    const nonOwnerEditRes = await fetch(`${baseUrl}/study-groups/${createdGroupId}`, {
      method: 'PATCH',
      headers: otherHeaders,
      body: JSON.stringify({ name: 'Hacked Group Name' }),
    });
    const nonOwnerEditData = await nonOwnerEditRes.json();
    if (nonOwnerEditRes.status === 403 && nonOwnerEditData.success === false) {
      console.log(`✅ PASS: Non-owner edit forbidden (403): "${nonOwnerEditData.message}"`);
    } else {
      throw new Error(`FAIL: Expected 403 for non-owner edit, got ${nonOwnerEditRes.status}`);
    }

    // 8. Owner CAN edit own group
    console.log('\n[Test 8] Owner can edit group details (PATCH)...');
    const ownerEditRes = await fetch(`${baseUrl}/study-groups/${createdGroupId}`, {
      method: 'PATCH',
      headers: ownerHeaders,
      body: JSON.stringify({
        name: 'Distributed Systems & Cloud Consensus',
        description: 'Updated description for advanced consensus and Raft implementations.',
        maxMembers: 10,
      }),
    });
    const ownerEditData = await ownerEditRes.json();
    if (ownerEditRes.status === 200 && ownerEditData.data.group.name === 'Distributed Systems & Cloud Consensus') {
      console.log('✅ PASS: Owner successfully updated group name and maxMembers.');
    } else {
      throw new Error(`FAIL: Expected 200, got ${ownerEditRes.status}: ${JSON.stringify(ownerEditData)}`);
    }

    // 9. Non-owner cannot archive/delete group (403)
    console.log('\n[Test 9] Non-owner deleting group returns 403 Forbidden...');
    const nonOwnerDelRes = await fetch(`${baseUrl}/study-groups/${createdGroupId}`, {
      method: 'DELETE',
      headers: otherHeaders,
    });
    if (nonOwnerDelRes.status === 403) {
      console.log('✅ PASS: Non-owner delete forbidden with 403.');
    } else {
      throw new Error(`FAIL: Expected 403 for non-owner delete, got ${nonOwnerDelRes.status}`);
    }

    // 10. Member can leave group
    console.log('\n[Test 10] Peer can leave group (POST /:id/leave)...');
    const peerLeaveRes = await fetch(`${baseUrl}/study-groups/${createdGroupId}/leave`, {
      method: 'POST',
      headers: otherHeaders,
    });
    const peerLeaveData = await peerLeaveRes.json();
    if (peerLeaveRes.status === 200 && peerLeaveData.data.group.memberCount === 2) {
      console.log('✅ PASS: Peer left group successfully. Member count is now 2.');
    } else {
      throw new Error(`FAIL: Expected 200, got ${peerLeaveRes.status}: ${JSON.stringify(peerLeaveData)}`);
    }

    // 11. Search, Filters, Sorting, and Pagination
    console.log('\n[Test 11] GET /api/study-groups search, filters, and pagination...');
    
    // 11a: Search query
    const searchRes = await fetch(`${baseUrl}/study-groups?search=Consensus`, {
      headers: ownerHeaders,
    });
    const searchData = await searchRes.json();
    if (searchRes.status === 200 && searchData.data.groups.length >= 1) {
      console.log(`✅ PASS: Search for "Consensus" found ${searchData.data.groups.length} group(s).`);
    } else {
      throw new Error(`FAIL: Search failed: ${JSON.stringify(searchData)}`);
    }

    // 11b: Subject filter
    const subjRes = await fetch(`${baseUrl}/study-groups?subject=Computer%20Science`, {
      headers: ownerHeaders,
    });
    const subjData = await subjRes.json();
    if (subjRes.status === 200 && subjData.data.groups.every((g) => g.subject.toLowerCase() === 'computer science')) {
      console.log(`✅ PASS: Subject filter matches ${subjData.data.groups.length} CS groups.`);
    } else {
      throw new Error('FAIL: Subject filter did not properly filter');
    }

    // 11c: Level filter
    const levelRes = await fetch(`${baseUrl}/study-groups?level=intermediate`, {
      headers: ownerHeaders,
    });
    const levelData = await levelRes.json();
    if (levelRes.status === 200 && levelData.data.groups.every((g) => g.level.toLowerCase() === 'intermediate')) {
      console.log(`✅ PASS: Level filter returned ${levelData.data.groups.length} intermediate groups.`);
    } else {
      throw new Error('FAIL: Level filter failed');
    }

    // 11d: hasSpace filter
    const spaceRes = await fetch(`${baseUrl}/study-groups?hasSpace=true`, {
      headers: ownerHeaders,
    });
    const spaceData = await spaceRes.json();
    if (spaceRes.status === 200 && spaceData.data.groups.every((g) => g.memberCount < g.maxMembers)) {
      console.log(`✅ PASS: hasSpace filter returned only groups with open spots.`);
    } else {
      throw new Error('FAIL: hasSpace filter failed');
    }

    // 11e: Pagination response structure
    const pageRes = await fetch(`${baseUrl}/study-groups?page=1&limit=4`, {
      headers: ownerHeaders,
    });
    const pageData = await pageRes.json();
    const pag = pageData.data.pagination;
    if (pag && pag.page === 1 && pag.limit === 4 && typeof pag.total === 'number' && typeof pag.totalPages === 'number') {
      console.log(`✅ PASS: Pagination contract verified: Page ${pag.page}/${pag.totalPages}, Total ${pag.total}.`);
    } else {
      throw new Error(`FAIL: Pagination format mismatch: ${JSON.stringify(pag)}`);
    }

    // 12. Owner can archive group (soft-delete) & excluded from default query
    console.log('\n[Test 12] Owner archiving group sets status to archived and excludes from default list...');
    const archiveRes = await fetch(`${baseUrl}/study-groups/${createdGroupId}`, {
      method: 'DELETE',
      headers: ownerHeaders,
    });
    const archiveData = await archiveRes.json();
    if (archiveRes.status === 200 && archiveData.success === true) {
      console.log('✅ PASS: Group archived successfully.');
    } else {
      throw new Error(`FAIL: Expected 200, got ${archiveRes.status}: ${JSON.stringify(archiveData)}`);
    }

    // Confirm group is excluded from active list
    const listAfterArchive = await fetch(`${baseUrl}/study-groups?search=Consensus`, {
      headers: ownerHeaders,
    });
    const listAfterData = await listAfterArchive.json();
    const foundArchived = listAfterData.data.groups.some((g) => g.id === createdGroupId);
    if (!foundArchived) {
      console.log('✅ PASS: Archived group excluded from active list by default.');
    } else {
      throw new Error('FAIL: Archived group still present in active list');
    }

    // Cleanup test data from MongoDB
    await StudyGroup.deleteOne({ _id: createdGroupId });
    await User.deleteMany({ email: { $in: [ownerEmail, otherEmail, thirdEmail, fourthEmail] } });

    console.log('\n🎉 ALL 12 BACKEND TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.connection.close();
  }
}

runStudyGroupTests();

