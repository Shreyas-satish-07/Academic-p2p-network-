import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  app,
  request,
  connectTestDB,
  disconnectTestDB,
  createTestUser,
  User,
} from './testHelper.js';
import StudyGroup from '../models/StudyGroup.js';
import Resource from '../models/Resource.js';
import Discussion from '../models/Discussion.js';
import Conversation from '../models/Conversation.js';

describe('Resource Ownership and Authorization Integration Tests', () => {
  const createdUserIds = [];
  const createdGroupIds = [];
  const createdResourceIds = [];
  const createdDiscussionIds = [];
  const createdConversationIds = [];

  let userA, userB, userC;

  beforeAll(async () => {
    await connectTestDB();

    userA = await createTestUser({ name: 'Owner User A' });
    userB = await createTestUser({ name: 'Unauthorized User B' });
    userC = await createTestUser({ name: 'Third Party User C' });

    createdUserIds.push(userA.user._id, userB.user._id, userC.user._id);
  });

  afterAll(async () => {
    if (createdGroupIds.length > 0) {
      await StudyGroup.deleteMany({ _id: { $in: createdGroupIds } });
    }
    if (createdResourceIds.length > 0) {
      await Resource.deleteMany({ _id: { $in: createdResourceIds } });
    }
    if (createdDiscussionIds.length > 0) {
      await Discussion.deleteMany({ _id: { $in: createdDiscussionIds } });
    }
    if (createdConversationIds.length > 0) {
      await Conversation.deleteMany({ _id: { $in: createdConversationIds } });
    }
    if (createdUserIds.length > 0) {
      await User.deleteMany({ _id: { $in: createdUserIds } });
    }
    await disconnectTestDB();
  });

  describe('Study Groups Authorization', () => {
    it('should reject editing another user’s study group with 403 Forbidden', async () => {
      // User A creates study group
      const createRes = await request(app)
        .post('/api/study-groups')
        .set(userA.authHeader)
        .send({
          name: 'Distributed Systems Core',
          description: 'Deep dive into consensus and Paxos algorithms.',
          subject: 'Computer Science',
          level: 'advanced',
          maxMembers: 10,
        })
        .expect(201);

      const groupId = createRes.body.data.group._id;
      createdGroupIds.push(groupId);

      // User B attempts to edit User A's study group
      const updateRes = await request(app)
        .patch(`/api/study-groups/${groupId}`)
        .set(userB.authHeader)
        .send({ name: 'Hijacked Study Group Name' })
        .expect(403);

      expect(updateRes.body.success).toBe(false);
      expect(updateRes.body.message).toMatch(/only the group owner/i);
    });

    it('should reject deleting another user’s study group with 403 Forbidden', async () => {
      const createRes = await request(app)
        .post('/api/study-groups')
        .set(userA.authHeader)
        .send({
          name: 'Security & Cryptography',
          description: 'Exploring modern zero knowledge proofs.',
          subject: 'Cybersecurity',
          level: 'intermediate',
          maxMembers: 8,
        })
        .expect(201);

      const groupId = createRes.body.data.group._id;
      createdGroupIds.push(groupId);

      // User B attempts to delete User A's study group
      const deleteRes = await request(app)
        .delete(`/api/study-groups/${groupId}`)
        .set(userB.authHeader)
        .expect(403);

      expect(deleteRes.body.success).toBe(false);
      expect(deleteRes.body.message).toMatch(/only the group owner/i);
    });
  });

  describe('Learning Resources Authorization', () => {
    it('should reject editing another user’s resource with 403 Forbidden', async () => {
      // User A creates resource
      const createRes = await request(app)
        .post('/api/resources')
        .set(userA.authHeader)
        .send({
          title: 'Official TypeScript Handbook',
          description: 'Complete comprehensive TypeScript guide for engineers.',
          resourceType: 'link',
          url: 'https://www.typescriptlang.org/docs/handbook/',
          subject: 'Software Engineering',
          level: 'intermediate',
          visibility: 'public',
        })
        .expect(201);

      const resourceId = createRes.body.data.resource._id;
      createdResourceIds.push(resourceId);

      // User B attempts to update User A's resource
      const updateRes = await request(app)
        .patch(`/api/resources/${resourceId}`)
        .set(userB.authHeader)
        .send({ title: 'Unauthorized Modification of Resource' })
        .expect(403);

      expect(updateRes.body.success).toBe(false);
      expect(updateRes.body.message).toMatch(/creator/i);
    });

    it('should reject deleting another user’s resource with 403 Forbidden', async () => {
      const createRes = await request(app)
        .post('/api/resources')
        .set(userA.authHeader)
        .send({
          title: 'Rust Programming Language Guide',
          description: 'Systems programming with fearless concurrency.',
          resourceType: 'link',
          url: 'https://doc.rust-lang.org/book/',
          subject: 'Systems',
          level: 'advanced',
          visibility: 'public',
        })
        .expect(201);

      const resourceId = createRes.body.data.resource._id;
      createdResourceIds.push(resourceId);

      // User B attempts to delete User A's resource
      const deleteRes = await request(app)
        .delete(`/api/resources/${resourceId}`)
        .set(userB.authHeader)
        .expect(403);

      expect(deleteRes.body.success).toBe(false);
      expect(deleteRes.body.message).toMatch(/creator/i);
    });
  });

  describe('Discussions Authorization', () => {
    it('should reject editing another user’s discussion post with 403 Forbidden', async () => {
      // User A creates discussion
      const createRes = await request(app)
        .post('/api/discussions')
        .set(userA.authHeader)
        .send({
          title: 'Understanding Actor Model Concurrency',
          content: 'How does the Erlang/Akka actor model compare to CSP in Go? Looking for deep insights.',
          subject: 'Architecture',
        })
        .expect(201);

      const discussionId = createRes.body.data._id || createRes.body.data.id;
      createdDiscussionIds.push(discussionId);

      // User B attempts to update User A's discussion
      const updateRes = await request(app)
        .patch(`/api/discussions/${discussionId}`)
        .set(userB.authHeader)
        .send({ title: 'Tampered Discussion Post Title' })
        .expect(403);

      expect(updateRes.body.success).toBe(false);
      expect(updateRes.body.message).toMatch(/author/i);
    });

    it('should reject deleting another user’s discussion post with 403 Forbidden', async () => {
      const createRes = await request(app)
        .post('/api/discussions')
        .set(userA.authHeader)
        .send({
          title: 'Comparing Raft vs Multi-Paxos Consistency',
          content: 'What are the practical trade-offs when implementing Raft in modern microservice backends?',
          subject: 'Distributed Systems',
        })
        .expect(201);

      const discussionId = createRes.body.data._id || createRes.body.data.id;
      createdDiscussionIds.push(discussionId);

      // User B attempts to delete User A's discussion
      const deleteRes = await request(app)
        .delete(`/api/discussions/${discussionId}`)
        .set(userB.authHeader)
        .expect(403);

      expect(deleteRes.body.success).toBe(false);
      expect(deleteRes.body.message).toMatch(/author/i);
    });
  });

  describe('Direct Messaging Authorization', () => {
    it('should reject non-participant user from accessing a private direct conversation with 403 Forbidden', async () => {
      // User A creates conversation with User B
      const convRes = await request(app)
        .post('/api/messages/conversations/direct')
        .set(userA.authHeader)
        .send({ participantId: userB.user._id });

      expect([200, 201]).toContain(convRes.status);

      const conversationId =
        convRes.body.data?.conversation?._id ||
        convRes.body.data?.conversation?.id ||
        convRes.body.data?._id ||
        convRes.body.data?.id;
      createdConversationIds.push(conversationId);

      // User C (not a participant) attempts to fetch the conversation details
      const unauthorizedGetRes = await request(app)
        .get(`/api/messages/conversations/${conversationId}`)
        .set(userC.authHeader)
        .expect(403);

      expect(unauthorizedGetRes.body.success).toBe(false);
      expect(unauthorizedGetRes.body.message).toMatch(/not a participant/i);

      // User C attempts to read messages in the private conversation
      const unauthorizedMsgRes = await request(app)
        .get(`/api/messages/conversations/${conversationId}/messages`)
        .set(userC.authHeader)
        .expect(403);

      expect(unauthorizedMsgRes.body.success).toBe(false);
      expect(unauthorizedMsgRes.body.message).toMatch(/not a participant/i);
    });
  });
});
