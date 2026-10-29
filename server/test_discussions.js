import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './server.js';
import User from './models/User.js';
import Discussion from './models/Discussion.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

let server;

async function runDiscussionTests() {
  console.log('--- Starting Phase 7 Discussions Backend Verification Tests ---');

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  const port = 5005;
  server = app.listen(port);
  const baseUrl = `http://localhost:${port}/api`;

  let authorToken = '';
  let authorUser = null;
  let peerToken = '';
  let peerUser = null;
  let createdDiscussionId = '';
  let firstAnswerId = '';
  let secondAnswerId = '';

  const authorEmail = `disc_author_${Date.now()}@example.com`;
  const peerEmail = `disc_peer_${Date.now()}@example.com`;

  try {
    // 1. Unauthorized requests return 401
    console.log('\n[Test 1] Unauthorized requests return 401...');
    const unauthGet = await fetch(`${baseUrl}/discussions`);
    const unauthGetData = await unauthGet.json();
    if (unauthGet.status === 401 && unauthGetData.success === false) {
      console.log('✅ PASS: GET /api/discussions returned 401 without auth token.');
    } else {
      throw new Error(`FAIL: Expected 401, got ${unauthGet.status}: ${JSON.stringify(unauthGetData)}`);
    }

    const unauthPost = await fetch(`${baseUrl}/discussions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Unauthorized Discussion Question' }),
    });
    if (unauthPost.status === 401) {
      console.log('✅ PASS: POST /api/discussions returned 401 without auth token.');
    } else {
      throw new Error(`FAIL: Expected 401 for unauthenticated POST`);
    }

    // Register author and peer test users
    console.log('\n[Setup] Registering Author and Peer users...');
    const regAuthor = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Discussion Author',
        email: authorEmail,
        password: 'Password123!',
        college: 'RV College of Engineering',
        department: 'Computer Science and Engineering',
        semester: 6,
      }),
    });
    const regAuthorData = await regAuthor.json();
    authorToken = regAuthorData.data?.token;
    authorUser = regAuthorData.data?.user;

    const regPeer = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Peer Student',
        email: peerEmail,
        password: 'Password123!',
        college: 'BMS College of Engineering',
        department: 'Information Science',
        semester: 6,
      }),
    });
    const regPeerData = await regPeer.json();
    peerToken = regPeerData.data?.token;
    peerUser = regPeerData.data?.user;

    if (!authorToken || !peerToken) {
      throw new Error('Failed to obtain tokens for author or peer user');
    }
    console.log('✅ PASS: Test users registered and authenticated.');

    // 2. Create discussion assigns creator as author
    console.log('\n[Test 2] Create discussion assigns creator as author and validates input...');
    const createRes = await fetch(`${baseUrl}/discussions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorToken}`,
      },
      body: JSON.stringify({
        title: 'How does Multi-Version Concurrency Control (MVCC) work in PostgreSQL?',
        content:
          'I am trying to understand how PostgreSQL handles read-committed isolation without locking tables. Does it create tuple versions with xmin and xmax headers?',
        subject: 'DBMS',
        topics: ['DBMS', 'Concurrency', 'PostgreSQL'],
        tags: ['MVCC', 'PostgreSQL', 'Concurrency'],
      }),
    });
    const createData = await createRes.json();
    if (createRes.status === 201 && createData.success) {
      createdDiscussionId = createData.data?.id || createData.data?._id;
      if (
        createData.data?.authorId === authorUser.id ||
        createData.data?.authorUser?.id === authorUser.id ||
        createData.data?.isAuthor === true
      ) {
        console.log('✅ PASS: Discussion created and creator assigned as author.');
      } else {
        throw new Error('FAIL: Creator not assigned as discussion author');
      }
    } else {
      throw new Error(`FAIL: Create discussion returned ${createRes.status}: ${JSON.stringify(createData)}`);
    }

    // 3. Discussion list API supports filtering, sorting, pagination, and includes safe metrics
    console.log('\n[Test 3] List discussions with filter and search...');
    const listRes = await fetch(`${baseUrl}/discussions?subject=DBMS&search=MVCC&sort=newest`, {
      headers: { Authorization: `Bearer ${authorToken}` },
    });
    const listData = await listRes.json();
    if (listRes.status === 200 && listData.success) {
      const items = listData.data.discussions;
      const pagination = listData.data.pagination;
      if (items.length > 0 && pagination.total >= 1) {
        const first = items[0];
        if (
          first.voteCount !== undefined &&
          first.answerCount !== undefined &&
          first.isVotedByCurrentUser !== undefined &&
          first.acceptedAnswerExists !== undefined &&
          first.author
        ) {
          console.log('✅ PASS: List API returned discussions with metrics and pagination.');
        } else {
          throw new Error('FAIL: Discussion item missing required metric fields');
        }
      } else {
        throw new Error('FAIL: Filtered list returned no items');
      }
    } else {
      throw new Error(`FAIL: List API returned ${listRes.status}`);
    }

    // 4. View count increments via POST /api/discussions/:id/view
    console.log('\n[Test 4] Increment view count...');
    const viewRes = await fetch(`${baseUrl}/discussions/${createdDiscussionId}/view`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${peerToken}` },
    });
    const viewData = await viewRes.json();
    if (viewRes.status === 200 && viewData.data?.views >= 1) {
      console.log('✅ PASS: Discussion view count incremented successfully.');
    } else {
      throw new Error(`FAIL: View increment returned ${viewRes.status}: ${JSON.stringify(viewData)}`);
    }

    // 5. Discussion vote toggle via POST /api/discussions/:id/vote
    console.log('\n[Test 5] Discussion vote toggles on/off...');
    const vote1Res = await fetch(`${baseUrl}/discussions/${createdDiscussionId}/vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${peerToken}` },
    });
    const vote1Data = await vote1Res.json();
    if (vote1Res.status === 200 && vote1Data.data?.isVotedByCurrentUser === true && vote1Data.data?.voteCount === 1) {
      console.log('✅ PASS: Discussion upvote added successfully.');
    } else {
      throw new Error(`FAIL: Upvote failed: ${JSON.stringify(vote1Data)}`);
    }

    const vote2Res = await fetch(`${baseUrl}/discussions/${createdDiscussionId}/vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${peerToken}` },
    });
    const vote2Data = await vote2Res.json();
    if (vote2Res.status === 200 && vote2Data.data?.isVotedByCurrentUser === false && vote2Data.data?.voteCount === 0) {
      console.log('✅ PASS: Discussion upvote removed upon second call (toggle).');
    } else {
      throw new Error(`FAIL: Upvote toggle removal failed: ${JSON.stringify(vote2Data)}`);
    }

    // 6. Discussion author can update, non-author gets 403
    console.log('\n[Test 6] Discussion edit authorization...');
    const forbiddenEdit = await fetch(`${baseUrl}/discussions/${createdDiscussionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${peerToken}`,
      },
      body: JSON.stringify({ title: 'Hacked Title By Non-Author' }),
    });
    if (forbiddenEdit.status === 403) {
      console.log('✅ PASS: Non-author edit rejected with 403 Forbidden.');
    } else {
      throw new Error(`FAIL: Non-author edit should return 403, got ${forbiddenEdit.status}`);
    }

    const authorEdit = await fetch(`${baseUrl}/discussions/${createdDiscussionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorToken}`,
      },
      body: JSON.stringify({
        title: 'How does Multi-Version Concurrency Control (MVCC) work in PostgreSQL? [Updated]',
      }),
    });
    const authorEditData = await authorEdit.json();
    if (authorEdit.status === 200 && authorEditData.data?.title.includes('[Updated]')) {
      console.log('✅ PASS: Author updated discussion successfully.');
    } else {
      throw new Error(`FAIL: Author update failed: ${JSON.stringify(authorEditData)}`);
    }

    // 7. Answer posting by peer
    console.log('\n[Test 7] Post answer to discussion...');
    const ans1Res = await fetch(`${baseUrl}/discussions/${createdDiscussionId}/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${peerToken}`,
      },
      body: JSON.stringify({
        content:
          'Yes, PostgreSQL writes new tuple versions into the page heap and marks previous rows with xmax pointing to the updating transaction ID. Vacuum later cleans up dead tuples.',
      }),
    });
    const ans1Data = await ans1Res.json();
    if (ans1Res.status === 201 && ans1Data.success) {
      firstAnswerId = ans1Data.data?.answer?.id || ans1Data.data?.answer?._id;
      console.log('✅ PASS: Peer posted an answer successfully.');
    } else {
      throw new Error(`FAIL: Post answer failed: ${JSON.stringify(ans1Data)}`);
    }

    // Post a second answer by author to test accepted answer exclusivity
    const ans2Res = await fetch(`${baseUrl}/discussions/${createdDiscussionId}/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorToken}`,
      },
      body: JSON.stringify({
        content:
          'Another key detail is that read queries take a snapshot of active transaction IDs at query start, guaranteeing consistent view without blocking write transactions.',
      }),
    });
    const ans2Data = await ans2Res.json();
    secondAnswerId = ans2Data.data?.answer?.id || ans2Data.data?.answer?._id;

    // 8. Answer vote toggle
    console.log('\n[Test 8] Answer vote toggle...');
    const ansVoteRes = await fetch(`${baseUrl}/discussions/${createdDiscussionId}/answers/${firstAnswerId}/vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authorToken}` },
    });
    const ansVoteData = await ansVoteRes.json();
    if (ansVoteRes.status === 200 && ansVoteData.data?.voteCount === 1) {
      console.log('✅ PASS: Answer upvoted successfully.');
    } else {
      throw new Error(`FAIL: Answer vote failed: ${JSON.stringify(ansVoteData)}`);
    }

    // 9. Answer acceptance permissions & exclusivity
    console.log('\n[Test 9] Mark answer accepted and test exclusivity...');
    // Peer tries to accept answer -> 403 Forbidden
    const unauthAccept = await fetch(
      `${baseUrl}/discussions/${createdDiscussionId}/answers/${firstAnswerId}/accept`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${peerToken}` },
      }
    );
    if (unauthAccept.status === 403) {
      console.log('✅ PASS: Non-author accept action rejected with 403 Forbidden.');
    } else {
      throw new Error(`FAIL: Non-author accept should return 403, got ${unauthAccept.status}`);
    }

    // Author accepts first answer
    const accept1Res = await fetch(
      `${baseUrl}/discussions/${createdDiscussionId}/answers/${firstAnswerId}/accept`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${authorToken}` },
      }
    );
    const accept1Data = await accept1Res.json();
    if (
      accept1Res.status === 200 &&
      accept1Data.data?.isAccepted === true &&
      accept1Data.data?.discussion?.status === 'resolved'
    ) {
      console.log('✅ PASS: Discussion author accepted first answer, status set to resolved.');
    } else {
      throw new Error(`FAIL: Accept first answer failed: ${JSON.stringify(accept1Data)}`);
    }

    // Author accepts second answer -> first answer should be unset as accepted
    const accept2Res = await fetch(
      `${baseUrl}/discussions/${createdDiscussionId}/answers/${secondAnswerId}/accept`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${authorToken}` },
      }
    );
    const accept2Data = await accept2Res.json();
    if (accept2Res.status === 200 && accept2Data.data?.isAccepted === true) {
      const answers = accept2Data.data?.discussion?.answers;
      const ans1 = answers.find((a) => a.id === firstAnswerId);
      const ans2 = answers.find((a) => a.id === secondAnswerId);
      if (ans1?.isAccepted === false && ans2?.isAccepted === true) {
        console.log('✅ PASS: Exclusivity preserved - first answer unset when second accepted.');
      } else {
        throw new Error('FAIL: Multiple answers marked accepted simultaneously');
      }
    } else {
      throw new Error(`FAIL: Accept second answer failed: ${JSON.stringify(accept2Data)}`);
    }

    // 10. Answer edit and delete authorization
    console.log('\n[Test 10] Answer edit and delete authorization...');
    // Author tries to edit peer's answer -> 403
    const forbiddenAnsEdit = await fetch(
      `${baseUrl}/discussions/${createdDiscussionId}/answers/${firstAnswerId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authorToken}`,
        },
        body: JSON.stringify({ content: 'Author trying to tamper with peer answer' }),
      }
    );
    if (forbiddenAnsEdit.status === 403) {
      console.log('✅ PASS: Editing another user\'s answer rejected with 403 Forbidden.');
    } else {
      throw new Error(`FAIL: Expected 403 for tampering answer`);
    }

    // Peer edits own answer
    const peerEditAns = await fetch(
      `${baseUrl}/discussions/${createdDiscussionId}/answers/${firstAnswerId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${peerToken}`,
        },
        body: JSON.stringify({
          content: 'Updated: PostgreSQL writes new tuple versions into heap with xmin/xmax headers.',
        }),
      }
    );
    if (peerEditAns.status === 200) {
      console.log('✅ PASS: Answer author edited their own answer.');
    } else {
      throw new Error(`FAIL: Answer author edit failed: ${peerEditAns.status}`);
    }

    // 11. Soft-delete discussion
    console.log('\n[Test 11] Discussion soft deletion...');
    const forbiddenDelete = await fetch(`${baseUrl}/discussions/${createdDiscussionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${peerToken}` },
    });
    if (forbiddenDelete.status === 403) {
      console.log('✅ PASS: Non-author discussion deletion rejected with 403 Forbidden.');
    } else {
      throw new Error(`FAIL: Expected 403 for non-author delete`);
    }

    const authorDelete = await fetch(`${baseUrl}/discussions/${createdDiscussionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authorToken}` },
    });
    if (authorDelete.status === 200) {
      console.log('✅ PASS: Discussion author soft-deleted (archived) discussion.');
    } else {
      throw new Error(`FAIL: Author delete failed: ${authorDelete.status}`);
    }

    // Verify archived discussion excluded by default in list
    const verifyList = await fetch(`${baseUrl}/discussions?search=MVCC`, {
      headers: { Authorization: `Bearer ${authorToken}` },
    });
    const verifyListData = await verifyList.json();
    const foundArchived = verifyListData.data.discussions.some((d) => d.id === createdDiscussionId);
    if (!foundArchived) {
      console.log('✅ PASS: Archived discussion excluded from active list queries.');
    } else {
      throw new Error('FAIL: Archived discussion still returned in active list query');
    }

    console.log('\n🎉 ALL PHASE 7 DISCUSSION BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (error) {
    console.error('\n❌ TEST FAILURE:', error.message);
    process.exitCode = 1;
  } finally {
    // Cleanup test users and test discussions
    try {
      if (authorUser?._id || authorUser?.id) {
        await User.findByIdAndDelete(authorUser._id || authorUser.id);
      }
      if (peerUser?._id || peerUser?.id) {
        await User.findByIdAndDelete(peerUser._id || peerUser.id);
      }
      if (createdDiscussionId) {
        await Discussion.findByIdAndDelete(createdDiscussionId);
      }
    } catch {
      // Ignore cleanup error
    }

    if (server) {
      server.close();
    }
    await mongoose.connection.close();
    console.log('🔒 Test server stopped and DB closed.');
  }
}

runDiscussionTests();

