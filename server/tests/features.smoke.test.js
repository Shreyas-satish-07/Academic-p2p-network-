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
import Message from '../models/Message.js';

describe('Core Features Integration Smoke Tests', () => {
  const createdUserIds = [];
  const createdGroupIds = [];
  const createdResourceIds = [];
  const createdDiscussionIds = [];
  const createdConversationIds = [];

  let student1, student2;

  beforeAll(async () => {
    await connectTestDB();

    student1 = await createTestUser({ name: 'Smoke Student One' });
    student2 = await createTestUser({ name: 'Smoke Student Two' });

    createdUserIds.push(student1.user._id, student2.user._id);
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
      await Message.deleteMany({ conversation: { $in: createdConversationIds } });
      await Conversation.deleteMany({ _id: { $in: createdConversationIds } });
    }
    if (createdUserIds.length > 0) {
      await User.deleteMany({ _id: { $in: createdUserIds } });
    }
    await disconnectTestDB();
  });

  it('1. Study Group Smoke Test: Create group, join group, and prevent duplicate join', async () => {
    // Student 1 creates group
    const createRes = await request(app)
      .post('/api/study-groups')
      .set(student1.authHeader)
      .send({
        name: 'Smoke Test Algorithm Group',
        description: 'Collaborative problem solving on dynamic programming and graph theory.',
        subject: 'Algorithms',
        level: 'intermediate',
        maxMembers: 5,
      })
      .expect(201);

    const groupId = createRes.body.data.group._id;
    createdGroupIds.push(groupId);
    expect(createRes.body.data.group.members).toHaveLength(1);
    expect(createRes.body.data.group.members[0].role).toBe('owner');

    // Student 2 joins group
    const joinRes = await request(app)
      .post(`/api/study-groups/${groupId}/join`)
      .set(student2.authHeader)
      .expect(200);

    expect(joinRes.body.success).toBe(true);
    expect(joinRes.body.data.group.members).toHaveLength(2);

    // Duplicate join rejected with 400 Bad Request
    const dupJoinRes = await request(app)
      .post(`/api/study-groups/${groupId}/join`)
      .set(student2.authHeader)
      .expect(400);

    expect(dupJoinRes.body.success).toBe(false);
    expect(dupJoinRes.body.message).toMatch(/already a member/i);
  });

  it('2. Resource Smoke Test: Create learning resource, view it, and like it', async () => {
    // Student 1 creates public resource
    const createRes = await request(app)
      .post('/api/resources')
      .set(student1.authHeader)
      .send({
        title: 'Modern React Architecture Guide',
        description: 'Design patterns for building resilient and maintainable React frontends.',
        resourceType: 'link',
        url: 'https://react.dev/learn',
        subject: 'Web Development',
        level: 'intermediate',
        visibility: 'public',
      })
      .expect(201);

    const resourceId = createRes.body.data.resource._id;
    createdResourceIds.push(resourceId);

    // Student 2 records a view
    const viewRes = await request(app)
      .post(`/api/resources/${resourceId}/view`)
      .set(student2.authHeader)
      .expect(200);

    expect(viewRes.body.success).toBe(true);
    const viewCount = viewRes.body.data.resource?.viewCount ?? viewRes.body.data.viewCount;
    expect(viewCount).toBe(1);

    // Student 2 likes the resource
    const likeRes = await request(app)
      .post(`/api/resources/${resourceId}/like`)
      .set(student2.authHeader)
      .expect(200);

    expect(likeRes.body.success).toBe(true);
    const resource = likeRes.body.data.resource;
    expect(resource.isLikedByCurrentUser).toBe(true);
    expect(resource.likeCount).toBe(1);
  });

  it('3. Discussion & Answer Smoke Test: Post discussion, submit answer, and accept answer', async () => {
    // Student 1 posts discussion question
    const createRes = await request(app)
      .post('/api/discussions')
      .set(student1.authHeader)
      .send({
        title: 'Best approach for optimizing React state in high-frequency dashboards?',
        content: 'When handling streaming real-time data, is React context sufficient or should we use Zustand/Signals?',
        subject: 'Frontend Architecture',
      })
      .expect(201);

    const discussionId = createRes.body.data._id || createRes.body.data.id;
    createdDiscussionIds.push(discussionId);

    // Student 2 posts an answer
    const answerRes = await request(app)
      .post(`/api/discussions/${discussionId}/answers`)
      .set(student2.authHeader)
      .send({
        content: 'For high-frequency updates, Zustand with selective selectors avoids unnecessary re-renders of unrelated components.',
      })
      .expect(201);

    expect(answerRes.body.success).toBe(true);
    const answer = answerRes.body.data.answer;
    expect(answer).toBeDefined();
    expect(answer.content).toMatch(/Zustand/i);

    // Student 1 (author) accepts Student 2's answer
    const acceptRes = await request(app)
      .post(`/api/discussions/${discussionId}/answers/${answer.id || answer._id}/accept`)
      .set(student1.authHeader)
      .expect(200);

    expect(acceptRes.body.success).toBe(true);
    expect(acceptRes.body.data.isAccepted).toBe(true);
  });

  it('4. Direct Messaging Smoke Test: Start conversation and send a direct message', async () => {
    // Student 1 creates or retrieves direct conversation with Student 2
    const convRes = await request(app)
      .post('/api/messages/conversations/direct')
      .set(student1.authHeader)
      .send({ participantId: student2.user._id });

    expect([200, 201]).toContain(convRes.status);

    const conversationId =
      convRes.body.data?.conversation?._id ||
      convRes.body.data?.conversation?.id ||
      convRes.body.data?._id ||
      convRes.body.data?.id;
    expect(conversationId).toBeDefined();
    createdConversationIds.push(conversationId);

    // Student 1 sends a direct message
    const msgRes = await request(app)
      .post(`/api/messages/conversations/${conversationId}/messages`)
      .set(student1.authHeader)
      .send({ content: 'Hey Student Two, are you interested in teaming up for the hackathon?' })
      .expect(201);

    expect(msgRes.body.success).toBe(true);
    expect(msgRes.body.data.message.content).toBe(
      'Hey Student Two, are you interested in teaming up for the hackathon?'
    );
  });
});
