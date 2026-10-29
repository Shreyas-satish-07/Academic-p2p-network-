import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './server.js';
import User from './models/User.js';
import Resource from './models/Resource.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

let server;

async function runResourceTests() {
  console.log('--- Starting Phase 6 Learning-Resource Sharing Backend Verification Tests ---');

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  const port = 5004;
  server = app.listen(port);
  const baseUrl = `http://localhost:${port}/api`;

  let creatorToken = '';
  let creatorUser = null;
  let peerToken = '';
  let peerUser = null;
  let createdResourceId = '';
  let privateResourceId = '';

  const creatorEmail = `res_creator_${Date.now()}@example.com`;
  const peerEmail = `res_peer_${Date.now()}@example.com`;

  try {
    // 1. Unauthorized requests return 401
    console.log('\n[Test 1] Unauthorized requests return 401...');
    const unauthGet = await fetch(`${baseUrl}/resources`);
    const unauthGetData = await unauthGet.json();
    if (unauthGet.status === 401 && unauthGetData.success === false) {
      console.log('✅ PASS: GET /api/resources returned 401 without auth token.');
    } else {
      throw new Error(`FAIL: Expected 401, got ${unauthGet.status}: ${JSON.stringify(unauthGetData)}`);
    }

    const unauthPost = await fetch(`${baseUrl}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Unauthorized Resource' }),
    });
    if (unauthPost.status === 401) {
      console.log('✅ PASS: POST /api/resources returned 401 without auth token.');
    } else {
      throw new Error(`FAIL: Expected 401 for unauthenticated POST`);
    }

    // Register creator and peer test users
    console.log('\n[Setup] Registering Creator and Peer users...');
    const regCreator = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Resource Creator',
        email: creatorEmail,
        password: 'Password123!',
        college: 'BMS College of Engineering',
        department: 'Computer Science and Engineering',
        semester: 6,
      }),
    });
    const regCreatorData = await regCreator.json();
    creatorToken = regCreatorData.data?.token;
    creatorUser = regCreatorData.data?.user;

    const regPeer = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Peer Student',
        email: peerEmail,
        password: 'Password123!',
        college: 'RV College of Engineering',
        department: 'Information Science and Engineering',
        semester: 6,
      }),
    });
    const regPeerData = await regPeer.json();
    peerToken = regPeerData.data?.token;
    peerUser = regPeerData.data?.user;

    console.log(`✅ Registered creator (${creatorUser.name}) and peer (${peerUser.name})`);

    const creatorHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${creatorToken}`,
    };
    const peerHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${peerToken}`,
    };

    // 2. Create resource works (POST /api/resources)
    console.log('\n[Test 2] POST /api/resources creates a new resource...');
    const createRes = await fetch(`${baseUrl}/resources`, {
      method: 'POST',
      headers: creatorHeaders,
      body: JSON.stringify({
        title: 'Distributed Consensus & Raft Notes.pdf',
        description: 'Comprehensive guide covering Raft leader election, log replication, and safety invariants.',
        subject: 'Computer Science',
        resourceType: 'document',
        url: 'https://raft.github.io/raft.pdf',
        topics: ['Distributed Systems', 'Consensus', 'Raft'],
        tags: ['Distributed Systems', 'Raft'],
        level: 'intermediate',
        visibility: 'public',
      }),
    });
    const createData = await createRes.json();
    if (createRes.status === 201 && createData.success === true) {
      createdResourceId = createData.data.resource.id;
      const resObj = createData.data.resource;
      if (
        resObj.isOwner === true &&
        resObj.likeCount === 0 &&
        resObj.saveCount === 0 &&
        resObj.creator.name === creatorUser.name
      ) {
        console.log(`✅ PASS: Created resource with ID ${createdResourceId}. Creator correctly assigned.`);
      } else {
        throw new Error(`FAIL: Resource structure mismatch: ${JSON.stringify(resObj)}`);
      }
    } else {
      throw new Error(`FAIL: Expected 201, got ${createRes.status}: ${JSON.stringify(createData)}`);
    }

    // 3. Create private resource for visibility test
    console.log('\n[Test 3] Create a private resource...');
    const createPrivRes = await fetch(`${baseUrl}/resources`, {
      method: 'POST',
      headers: creatorHeaders,
      body: JSON.stringify({
        title: 'My Secret Exam Scratchpad.pdf',
        description: 'Personal notes for upcoming midterm.',
        subject: 'Computer Science',
        resourceType: 'document',
        url: 'https://example.com/secret_notes.pdf',
        visibility: 'private',
      }),
    });
    const createPrivData = await createPrivRes.json();
    if (createPrivRes.status === 201 && createPrivData.data.resource.visibility === 'private') {
      privateResourceId = createPrivData.data.resource.id;
      console.log(`✅ PASS: Created private resource with ID ${privateResourceId}`);
    } else {
      throw new Error(`FAIL: Could not create private resource: ${JSON.stringify(createPrivData)}`);
    }

    // 4. Public/Private visibility rules
    console.log('\n[Test 4] Public/Private visibility rules...');
    // Peer fetching public resource -> 200
    const peerFetchPub = await fetch(`${baseUrl}/resources/${createdResourceId}`, {
      headers: peerHeaders,
    });
    if (peerFetchPub.status === 200) {
      console.log('✅ PASS: Peer can view public resource.');
    } else {
      throw new Error(`FAIL: Peer could not view public resource (status ${peerFetchPub.status})`);
    }

    // Peer fetching private resource -> 404 (Hidden from non-creator)
    const peerFetchPriv = await fetch(`${baseUrl}/resources/${privateResourceId}`, {
      headers: peerHeaders,
    });
    if (peerFetchPriv.status === 404) {
      console.log('✅ PASS: Peer cannot view private resource (returned 404).');
    } else {
      throw new Error(`FAIL: Expected 404 for private resource, got ${peerFetchPriv.status}`);
    }

    // Creator fetching own private resource -> 200
    const creatorFetchPriv = await fetch(`${baseUrl}/resources/${privateResourceId}`, {
      headers: creatorHeaders,
    });
    if (creatorFetchPriv.status === 200) {
      console.log('✅ PASS: Creator can view own private resource.');
    } else {
      throw new Error(`FAIL: Creator could not view own private resource (status ${creatorFetchPriv.status})`);
    }

    // 5. Non-creator updating resource returns 403 Forbidden
    console.log('\n[Test 5] Non-creator updating resource returns 403 Forbidden...');
    const nonOwnerUpdate = await fetch(`${baseUrl}/resources/${createdResourceId}`, {
      method: 'PATCH',
      headers: peerHeaders,
      body: JSON.stringify({ title: 'Hacked Title' }),
    });
    const nonOwnerUpdateData = await nonOwnerUpdate.json();
    if (nonOwnerUpdate.status === 403 && nonOwnerUpdateData.success === false) {
      console.log(`✅ PASS: Non-creator edit forbidden with message: "${nonOwnerUpdateData.message}"`);
    } else {
      throw new Error(`FAIL: Expected 403, got ${nonOwnerUpdate.status}`);
    }

    // 6. Creator updating resource works
    console.log('\n[Test 6] Creator updating resource (PATCH)...');
    const ownerUpdate = await fetch(`${baseUrl}/resources/${createdResourceId}`, {
      method: 'PATCH',
      headers: creatorHeaders,
      body: JSON.stringify({
        title: 'Distributed Consensus & Raft Notes (Updated)',
        level: 'advanced',
      }),
    });
    const ownerUpdateData = await ownerUpdate.json();
    if (
      ownerUpdate.status === 200 &&
      ownerUpdateData.data.resource.title === 'Distributed Consensus & Raft Notes (Updated)' &&
      ownerUpdateData.data.resource.level === 'advanced'
    ) {
      console.log('✅ PASS: Creator successfully updated title and level.');
    } else {
      throw new Error(`FAIL: Creator update failed: ${JSON.stringify(ownerUpdateData)}`);
    }

    // 7. Non-creator deleting resource returns 403 Forbidden
    console.log('\n[Test 7] Non-creator deleting resource returns 403 Forbidden...');
    const nonOwnerDelete = await fetch(`${baseUrl}/resources/${createdResourceId}`, {
      method: 'DELETE',
      headers: peerHeaders,
    });
    if (nonOwnerDelete.status === 403) {
      console.log('✅ PASS: Non-creator delete forbidden (403).');
    } else {
      throw new Error(`FAIL: Expected 403 for non-creator delete, got ${nonOwnerDelete.status}`);
    }

    // 8. Like toggle (POST /:id/like)
    console.log('\n[Test 8] Like toggle works (adds and removes like)...');
    // First call -> adds like
    const like1 = await fetch(`${baseUrl}/resources/${createdResourceId}/like`, {
      method: 'POST',
      headers: peerHeaders,
    });
    const like1Data = await like1.json();
    if (like1.status === 200 && like1Data.data.resource.likeCount === 1 && like1Data.data.resource.isLikedByCurrentUser === true) {
      console.log('✅ PASS: Like added (likeCount: 1, isLikedByCurrentUser: true).');
    } else {
      throw new Error(`FAIL: Like addition failed: ${JSON.stringify(like1Data)}`);
    }

    // Second call -> removes like
    const like2 = await fetch(`${baseUrl}/resources/${createdResourceId}/like`, {
      method: 'POST',
      headers: peerHeaders,
    });
    const like2Data = await like2.json();
    if (like2.status === 200 && like2Data.data.resource.likeCount === 0 && like2Data.data.resource.isLikedByCurrentUser === false) {
      console.log('✅ PASS: Like removed on toggle (likeCount: 0, isLikedByCurrentUser: false).');
    } else {
      throw new Error(`FAIL: Like removal failed: ${JSON.stringify(like2Data)}`);
    }

    // 9. Save toggle (POST /:id/save)
    console.log('\n[Test 9] Save toggle works (adds and removes save)...');
    // First call -> saves
    const save1 = await fetch(`${baseUrl}/resources/${createdResourceId}/save`, {
      method: 'POST',
      headers: peerHeaders,
    });
    const save1Data = await save1.json();
    if (save1.status === 200 && save1Data.data.resource.saveCount === 1 && save1Data.data.resource.isSavedByCurrentUser === true) {
      console.log('✅ PASS: Resource saved (saveCount: 1, isSavedByCurrentUser: true).');
    } else {
      throw new Error(`FAIL: Save addition failed: ${JSON.stringify(save1Data)}`);
    }

    // Verify saved=true filter returns it
    const savedFilterRes = await fetch(`${baseUrl}/resources?saved=true`, {
      headers: peerHeaders,
    });
    const savedFilterData = await savedFilterRes.json();
    if (savedFilterRes.status === 200 && savedFilterData.data.resources.some((r) => r.id === createdResourceId)) {
      console.log('✅ PASS: saved=true filter includes bookmarked resource.');
    } else {
      throw new Error('FAIL: saved=true filter did not include saved resource');
    }

    // Second call -> unsaves
    const save2 = await fetch(`${baseUrl}/resources/${createdResourceId}/save`, {
      method: 'POST',
      headers: peerHeaders,
    });
    const save2Data = await save2.json();
    if (save2.status === 200 && save2Data.data.resource.saveCount === 0 && save2Data.data.resource.isSavedByCurrentUser === false) {
      console.log('✅ PASS: Resource unsaved on toggle (saveCount: 0, isSavedByCurrentUser: false).');
    } else {
      throw new Error(`FAIL: Save removal failed: ${JSON.stringify(save2Data)}`);
    }

    // 10. Increment view count (POST /:id/view)
    console.log('\n[Test 10] POST /:id/view increments viewCount...');
    const view1 = await fetch(`${baseUrl}/resources/${createdResourceId}/view`, {
      method: 'POST',
      headers: peerHeaders,
    });
    const view1Data = await view1.json();
    if (view1.status === 200 && view1Data.data.resource.viewCount === 1) {
      console.log('✅ PASS: View count incremented to 1.');
    } else {
      throw new Error(`FAIL: View increment failed: ${JSON.stringify(view1Data)}`);
    }

    // 11. Search, filter, sorting, and pagination
    console.log('\n[Test 11] Search, filter, sorting, and pagination...');
    // Search query
    const searchRes = await fetch(`${baseUrl}/resources?search=Consensus`, {
      headers: peerHeaders,
    });
    const searchData = await searchRes.json();
    if (searchRes.status === 200 && searchData.data.resources.length >= 1) {
      console.log(`✅ PASS: Search for "Consensus" found ${searchData.data.resources.length} matching resource(s).`);
    } else {
      throw new Error(`FAIL: Search failed: ${JSON.stringify(searchData)}`);
    }

    // Pagination contract
    const pageRes = await fetch(`${baseUrl}/resources?page=1&limit=5`, {
      headers: peerHeaders,
    });
    const pageData = await pageRes.json();
    const pag = pageData.data.pagination;
    if (pag && pag.page === 1 && pag.limit === 5 && typeof pag.total === 'number' && typeof pag.totalPages === 'number') {
      console.log(`✅ PASS: Pagination contract verified: Page ${pag.page}/${pag.totalPages}, Total ${pag.total}.`);
    } else {
      throw new Error(`FAIL: Pagination contract mismatch: ${JSON.stringify(pag)}`);
    }

    // 12. Soft-delete / Archive (DELETE /:id)
    console.log('\n[Test 12] Soft-delete archives resource and excludes it from default list...');
    const archiveRes = await fetch(`${baseUrl}/resources/${createdResourceId}`, {
      method: 'DELETE',
      headers: creatorHeaders,
    });
    const archiveData = await archiveRes.json();
    if (archiveRes.status === 200 && archiveData.success === true) {
      console.log('✅ PASS: Resource archived successfully.');
    } else {
      throw new Error(`FAIL: Expected 200 for archive: ${JSON.stringify(archiveData)}`);
    }

    // Confirm it is excluded from active list
    const listAfterArchive = await fetch(`${baseUrl}/resources?search=Consensus`, {
      headers: peerHeaders,
    });
    const listAfterData = await listAfterArchive.json();
    const foundArchived = listAfterData.data.resources.some((r) => r.id === createdResourceId);
    if (!foundArchived) {
      console.log('✅ PASS: Archived resource excluded from active list by default.');
    } else {
      throw new Error('FAIL: Archived resource still found in default active list');
    }

    // Cleanup test resources and test users
    await Resource.deleteMany({ _id: { $in: [createdResourceId, privateResourceId] } });
    await User.deleteMany({ email: { $in: [creatorEmail, peerEmail] } });

    console.log('\n🎉 ALL 12 LEARNING-RESOURCE TESTS PASSED SUCCESSFULLY! 🎉\n');
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

runResourceTests();

