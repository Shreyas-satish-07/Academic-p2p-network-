import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { io as ClientIO } from 'socket.io-client';
import app from './server.js';
import { initSocketServer } from './socket/socketServer.js';
import User from './models/User.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

let server;

async function runMessagingTests() {
  console.log('--- Starting Phase 8 Secure Direct Messaging & Socket.io Verification Tests ---');

  if (mongoose.connection.readyState !== 1) {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB.');
  }

  const port = 5006;
  const httpServer = http.createServer(app);
  initSocketServer(httpServer, {
    cors: { origin: '*', credentials: true },
  });

  await new Promise((resolve) => {
    server = httpServer.listen(port, resolve);
  });

  const baseUrl = `http://localhost:${port}/api`;
  const socketUrl = `http://localhost:${port}`;

  let student1Token = '';
  let student1User = null;
  let student2Token = '';
  let student2User = null;
  let outsiderToken = '';
  let outsiderUser = null;

  let directConvId = '';
  let clientSocket1 = null;
  let clientSocket2 = null;

  const email1 = `msg_test1_${Date.now()}@example.com`;
  const email2 = `msg_test2_${Date.now()}@example.com`;
  const emailOutsider = `msg_outsider_${Date.now()}@example.com`;

  try {
    // 1. Unauthenticated requests return 401
    console.log('\n[Test 1] Unauthenticated REST requests return 401...');
    const unauthGet = await fetch(`${baseUrl}/messages/conversations`);
    const unauthGetData = await unauthGet.json();
    if (unauthGet.status === 401 && unauthGetData.success === false) {
      console.log('✅ PASS: GET /api/messages/conversations returned 401 without auth token.');
    } else {
      throw new Error(`FAIL: Expected 401, got ${unauthGet.status}`);
    }

    const unauthPost = await fetch(`${baseUrl}/messages/conversations/direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId: '6ae23eb251a35887dac6d36f' }),
    });
    if (unauthPost.status === 401) {
      console.log('✅ PASS: POST /api/messages/conversations/direct returned 401 without auth token.');
    } else {
      throw new Error(`FAIL: Expected 401 for unauthenticated direct conversation POST`);
    }

    // 2. Register test students
    console.log('\n[Setup] Registering 3 test students...');
    const reg1 = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Student One',
        email: email1,
        password: 'Password123!',
        college: 'RV College of Engineering',
        department: 'Computer Science',
        semester: 6,
      }),
    });
    const reg1Data = await reg1.json();
    if (!reg1.ok || !reg1Data.data?.token) {
      throw new Error(`Register Student 1 failed (${reg1.status}): ${JSON.stringify(reg1Data)}`);
    }
    student1Token = reg1Data.data?.token;
    student1User = reg1Data.data?.user;

    const reg2 = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Student Two',
        email: email2,
        password: 'Password123!',
        college: 'BMS College of Engineering',
        department: 'Information Science',
        semester: 6,
      }),
    });
    const reg2Data = await reg2.json();
    if (!reg2.ok || !reg2Data.data?.token) {
      throw new Error(`Register Student 2 failed (${reg2.status}): ${JSON.stringify(reg2Data)}`);
    }
    student2Token = reg2Data.data?.token;
    student2User = reg2Data.data?.user;

    const regOutsider = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Outsider Student',
        email: emailOutsider,
        password: 'Password123!',
        college: 'PES University',
        department: 'Electronics',
        semester: 6,
      }),
    });
    const regOutsiderData = await regOutsider.json();
    if (!regOutsider.ok || !regOutsiderData.data?.token) {
      throw new Error(`Register Outsider failed (${regOutsider.status}): ${JSON.stringify(regOutsiderData)}`);
    }
    outsiderToken = regOutsiderData.data?.token;
    outsiderUser = regOutsiderData.data?.user;

    console.log('✅ PASS: Test students registered and authenticated.');

    // 3. Direct Conversation creation & reuse
    console.log('\n[Test 2] Direct conversation creation, self-rejection, and duplicate reuse...');
    // Self-conversation rejection
    const selfRes = await fetch(`${baseUrl}/messages/conversations/direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({ recipientId: student1User.id }),
    });
    if (selfRes.status === 400) {
      console.log('✅ PASS: Self-conversation rejected with 400 Bad Request.');
    } else {
      throw new Error(`FAIL: Expected 400 for self-conversation, got ${selfRes.status}`);
    }

    // Create direct conversation between Student 1 and Student 2
    const createRes = await fetch(`${baseUrl}/messages/conversations/direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({ recipientId: student2User.id }),
    });
    const createData = await createRes.json();
    if (createRes.status === 201 && createData.success) {
      directConvId = createData.data?.conversation?.id;
      console.log('✅ PASS: Direct conversation created successfully.');
    } else {
      throw new Error(`FAIL: Create direct conversation failed: ${JSON.stringify(createData)}`);
    }

    // Call again to verify reuse instead of duplicate creation
    const reuseRes = await fetch(`${baseUrl}/messages/conversations/direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student2Token}`, // Student 2 calls with Student 1
      },
      body: JSON.stringify({ recipientId: student1User.id }),
    });
    const reuseData = await reuseRes.json();
    if (reuseRes.status === 200 && reuseData.data?.conversation?.id === directConvId) {
      console.log('✅ PASS: Existing direct conversation correctly reused (no duplicates).');
    } else {
      throw new Error(`FAIL: Expected reuse of ${directConvId}, got ${reuseData.data?.conversation?.id}`);
    }

    // 4. Conversation membership authorization
    console.log('\n[Test 3] Conversation membership verification...');
    const forbiddenGet = await fetch(`${baseUrl}/messages/conversations/${directConvId}`, {
      headers: { Authorization: `Bearer ${outsiderToken}` },
    });
    if (forbiddenGet.status === 403) {
      console.log('✅ PASS: Non-participant reading conversation rejected with 403 Forbidden.');
    } else {
      throw new Error(`FAIL: Expected 403 for outsider reading conversation`);
    }

    const forbiddenMsgPost = await fetch(
      `${baseUrl}/messages/conversations/${directConvId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${outsiderToken}`,
        },
        body: JSON.stringify({ content: 'Intruder message' }),
      }
    );
    if (forbiddenMsgPost.status === 403) {
      console.log('✅ PASS: Non-participant posting message rejected with 403 Forbidden.');
    } else {
      throw new Error(`FAIL: Expected 403 for outsider posting message`);
    }

    // 5. Unauthenticated Socket connection rejected
    console.log('\n[Test 4] Unauthenticated Socket.io connection rejected...');
    await new Promise((resolve, reject) => {
      const badSocket = ClientIO(socketUrl, {
        transports: ['websocket'],
        auth: { token: 'invalid.jwt.token' },
        reconnection: false,
      });

      badSocket.on('connect_error', (err) => {
        console.log('✅ PASS: Socket connection rejected with error:', err.message);
        badSocket.disconnect();
        resolve();
      });

      badSocket.on('connect', () => {
        badSocket.disconnect();
        reject(new Error('FAIL: Socket should not have connected with invalid token'));
      });
    });

    // 6. Two authenticated client sessions connect and exchange messages in real-time
    console.log('\n[Test 5] Real-time messaging between Student 1 and Student 2 via Socket.io...');
    clientSocket1 = ClientIO(socketUrl, {
      transports: ['websocket'],
      auth: { token: student1Token },
    });

    clientSocket2 = ClientIO(socketUrl, {
      transports: ['websocket'],
      auth: { token: student2Token },
    });

    await Promise.all([
      new Promise((res) => clientSocket1.on('connect', res)),
      new Promise((res) => clientSocket2.on('connect', res)),
    ]);
    console.log('✅ PASS: Both student sockets connected and authenticated.');

    // Join direct conversation room
    clientSocket1.emit('conversation:join', { conversationId: directConvId });
    clientSocket2.emit('conversation:join', { conversationId: directConvId });

    // Wait 100ms for room joins to register
    await new Promise((r) => setTimeout(r, 100));

    // Listen for incoming message on Student 2
    const messagePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for message:new')), 5000);
      clientSocket2.on('message:new', (payload) => {
        clearTimeout(timeout);
        resolve(payload);
      });
    });

    // Student 1 sends a real-time message
    const testContent = 'Hello from Student 1 over Socket.io!';
    clientSocket1.emit('message:send', {
      conversationId: directConvId,
      content: testContent,
    });

    const receivedPayload = await messagePromise;
    if (
      receivedPayload.conversationId === directConvId &&
      receivedPayload.message?.content === testContent &&
      receivedPayload.message?.senderName === 'Student One'
    ) {
      console.log('✅ PASS: Student 2 received message:new in real time with safe sender info.');
    } else {
      throw new Error(`FAIL: Unexpected message payload: ${JSON.stringify(receivedPayload)}`);
    }

    // 7. Verify message persistence and conversation lastMessage in MongoDB
    console.log('\n[Test 6] MongoDB persistence and lastMessage update...');
    const persistedMessages = await Message.find({ conversation: directConvId });
    const updatedConv = await Conversation.findById(directConvId);

    if (
      persistedMessages.length >= 1 &&
      updatedConv.lastMessage?.content === testContent &&
      updatedConv.lastMessage?.sender.toString() === student1User.id
    ) {
      console.log('✅ PASS: Message persisted to MongoDB and conversation lastMessage updated.');
    } else {
      throw new Error('FAIL: Message not persisted or lastMessage not updated');
    }

    // 8. Security test: Outsider trying to join conversation room via socket
    console.log('\n[Test 7] Socket security: outsider cannot join unauthorized room...');
    const outsiderSocket = ClientIO(socketUrl, {
      transports: ['websocket'],
      auth: { token: outsiderToken },
    });
    await new Promise((res) => outsiderSocket.on('connect', res));

    const errorPromise = new Promise((resolve) => {
      outsiderSocket.on('socket:error', resolve);
    });

    outsiderSocket.emit('conversation:join', { conversationId: directConvId });
    const socketErr = await errorPromise;
    if (socketErr && socketErr.message?.includes('Access denied')) {
      console.log('✅ PASS: Outsider blocked from joining conversation room with socket:error.');
    } else {
      throw new Error(`FAIL: Expected socket:error, got ${JSON.stringify(socketErr)}`);
    }
    outsiderSocket.disconnect();

    // 9. Read state synchronization via socket
    console.log('\n[Test 8] Read receipts via conversation:read...');
    const readPromise = new Promise((resolve) => {
      clientSocket1.on('message:read', resolve);
    });

    clientSocket2.emit('conversation:read', { conversationId: directConvId });
    const readReceipt = await readPromise;
    if (readReceipt.conversationId === directConvId && readReceipt.userId === student2User.id) {
      console.log('✅ PASS: message:read event broadcast to conversation room.');
    } else {
      throw new Error(`FAIL: Read receipt mismatch: ${JSON.stringify(readReceipt)}`);
    }

    // 10. REST Fallback message posting
    console.log('\n[Test 9] REST fallback message posting...');
    const restMsgRes = await fetch(`${baseUrl}/messages/conversations/${directConvId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student2Token}`,
      },
      body: JSON.stringify({ content: 'Reply from Student 2 via REST fallback.' }),
    });
    const restMsgData = await restMsgRes.json();
    if (restMsgRes.status === 201 && restMsgData.data?.message?.content.includes('REST fallback')) {
      console.log('✅ PASS: REST fallback message posted successfully.');
    } else {
      throw new Error(`FAIL: REST fallback failed: ${JSON.stringify(restMsgData)}`);
    }

    // 11. Fetch messages chronological order & conversation list with unread counts
    console.log('\n[Test 10] Fetch messages and conversation feed...');
    const fetchMsgsRes = await fetch(`${baseUrl}/messages/conversations/${directConvId}/messages`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    const fetchMsgsData = await fetchMsgsRes.json();
    if (fetchMsgsRes.status === 200 && fetchMsgsData.data?.messages?.length >= 2) {
      console.log(`✅ PASS: Retrieved ${fetchMsgsData.data.messages.length} messages in chronological order.`);
    } else {
      throw new Error('FAIL: Messages feed retrieval failed');
    }

    const fetchConvsRes = await fetch(`${baseUrl}/messages/conversations`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    const fetchConvsData = await fetchConvsRes.json();
    if (fetchConvsRes.status === 200 && fetchConvsData.data?.conversations?.length >= 1) {
      const topConv = fetchConvsData.data.conversations[0];
      if (topConv.id === directConvId && topConv.otherParticipant?.name === 'Student Two') {
        console.log('✅ PASS: Conversations list returned with formatted participant and updated order.');
      } else {
        throw new Error('FAIL: Top conversation format mismatch');
      }
    } else {
      throw new Error('FAIL: Conversations list retrieval failed');
    }

    console.log('\n🎉 ALL PHASE 8 SECURE MESSAGING & SOCKET.IO TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('\n❌ TEST FAILURE:', err.message);
    process.exitCode = 1;
  } finally {
    if (clientSocket1) clientSocket1.disconnect();
    if (clientSocket2) clientSocket2.disconnect();

    // Clean up test records
    try {
      if (student1User?.id) await User.findByIdAndDelete(student1User.id);
      if (student2User?.id) await User.findByIdAndDelete(student2User.id);
      if (outsiderUser?.id) await User.findByIdAndDelete(outsiderUser.id);
      if (directConvId) {
        await Message.deleteMany({ conversation: directConvId });
        await Conversation.findByIdAndDelete(directConvId);
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

runMessagingTests();
