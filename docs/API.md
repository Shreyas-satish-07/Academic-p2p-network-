# Cohort REST & Real-Time WebSocket API Reference

The Cohort platform provides a modular, RESTful API backed by Express, Mongoose, and Socket.io for peer discovery, collaborative study groups, educational resource sharing, academic discussions, and real-time student messaging.

---

## 1. Global Specifications

### Base URL
```
http://localhost:5000/api
```

### Authentication Header
Protected endpoints require a JSON Web Token (JWT) transmitted via the standard HTTP `Authorization` header:
```http
Authorization: Bearer <jwt_token>
```

### Rate Limiting
Public authentication endpoints (`/api/auth/register`, `/api/auth/login`) are protected by an in-memory rate limiter:
- **Window**: 15 minutes
- **Max Requests**: 20 requests per client IP
- **Rate Limit Response**: `429 Too Many Requests`
```json
{
  "success": false,
  "message": "Too many authentication requests from this IP, please try again after 15 minutes."
}
```

### Security & Payload Limits
- **Helmet**: Default secure HTTP response headers applied.
- **CORS**: Strictly permits requests from configured `CLIENT_URL` (default: `http://localhost:5173`).
- **Body Parser Limits**: Request payloads are capped at `1mb` for JSON and urlencoded requests.
- **Sensitive Data Shielding**: Password hashes and `__v` internals are excluded from all JSON serializations (`select: false` and schema transforms).
- **Production Errors**: Stack traces are concealed when `NODE_ENV === 'production'`.

---

## 2. Standard Response Schemas

### Success Response
```json
{
  "success": true,
  "message": "Human readable status description",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Specific error description"
}
```

---

## 3. Authentication Endpoints (`/api/auth`)

### Register Student
`POST /api/auth/register` (Public)

**Request Body:**
| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | 2–80 characters |
| `email` | string | Yes | Valid unique email format |
| `password` | string | Yes | Min 8 characters |
| `college` | string | Yes | College or university name |
| `department` | string | Yes | Academic department |
| `semester` | number | Yes | Integer between 1 and 12 |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Student account created successfully",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "_id": "67...31",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "college": "MIT",
      "department": "Computer Science",
      "semester": 6,
      "role": "student",
      "initials": "JD"
    }
  }
}
```

### Login Student
`POST /api/auth/login` (Public)

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Authenticated successfully",
  "data": {
    "token": "eyJhbGciOi...",
    "user": { ... }
  }
}
```

### Current Session Hydration
`GET /api/auth/me` (Protected)

Verifies and returns currently logged-in student user profile from the database.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

### Logout Notification
`POST /api/auth/logout` (Protected)

Notifies the server of session termination. Cleans up any server-side caches.

---

## 4. User Discovery & Profiles (`/api/users`)

### Discover Students & Peers
`GET /api/users` (Protected)

Computes dynamic peer compatibility scores (0–100%) based on shared skills, interests, and academic overlap.

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `search` | string | optional | Matches name, skills, interests, bio |
| `department`| string | optional | Exact department match |
| `semester` | number | optional | 1–12 |
| `skills` | string | optional | Comma-separated required skills |
| `interests` | string | optional | Comma-separated required interests |
| `sort` | string | `compatibility`| `compatibility`, `newest`, `name` |
| `page` | number | `1` | Page number |
| `limit` | number | `12` | Items per page (max 100) |

### Fetch Own Profile
`GET /api/users/me` (Protected)

Returns complete profile of authenticated student.

### Update Own Profile
`PATCH /api/users/me` (Protected)

Updates editable profile attributes. Restricts modifications to `email`, `password`, `role`, and `_id`.

**Request Body (Partial):**
```json
{
  "name": "Jane Doe",
  "bio": "Interested in distributed systems.",
  "skills": ["React", "Node.js", "Docker"],
  "interests": ["Cloud Architecture"],
  "availability": {
    "weekdays": "6:00 PM - 9:00 PM",
    "weekends": "10:00 AM - 4:00 PM",
    "preferredTeamSize": "3 to 4 peers",
    "openTo": ["Hackathons", "Study Groups"]
  }
}
```

### Public Student Profile
`GET /api/users/:id` (Protected)

Returns public student details and compatibility breakdown with current user.

---

## 5. Study Groups (`/api/study-groups`)

### List Study Groups
`GET /api/study-groups` (Protected)

**Query Parameters:**
- `search`, `subject`, `level` (`beginner` | `intermediate` | `advanced` | `all`), `meetingMode` (`online` | `offline` | `hybrid`), `status` (`active` | `archived`), `page`, `limit`.

### Create Study Group
`POST /api/study-groups` (Protected)

**Request Body:**
```json
{
  "name": "Distributed Systems Club",
  "description": "Weekly deep dive into consensus protocols.",
  "subject": "Computer Science",
  "topics": ["Paxos", "Raft", "CAP Theorem"],
  "level": "advanced",
  "meetingMode": "online",
  "maxMembers": 10,
  "schedule": {
    "days": ["Tuesday", "Thursday"],
    "time": "7:00 PM EST",
    "timezone": "UTC-5"
  }
}
```

### Group Details & Management
- `GET /api/study-groups/:id`: Retrieve group details and member rosters.
- `PATCH /api/study-groups/:id`: Update group metadata (Owner only).
- `DELETE /api/study-groups/:id`: Soft-delete group by archiving (Owner only).
- `POST /api/study-groups/:id/join`: Join group as member (Prevents duplicates and capacity overflow).
- `POST /api/study-groups/:id/leave`: Leave group (Owners cannot leave without transferring ownership).

---

## 6. Learning Resources (`/api/resources`)

### List Resources
`GET /api/resources` (Protected)

Retrieves all public resources plus any private resources owned by the caller.

**Query Parameters:**
- `search`, `resourceType` (`link` | `document` | `video` | `course` | `tool` | `other`), `subject`, `level`, `visibility` (`public` | `private`), `tag`, `sort` (`newest` | `popular` | `views` | `saves`), `page`, `limit`.

### Create Resource
`POST /api/resources` (Protected)

**Request Body:**
```json
{
  "title": "Clean Code Principles in TypeScript",
  "description": "Essential architectural standards for clean code.",
  "resourceType": "link",
  "url": "https://example.com/clean-code",
  "subject": "Software Engineering",
  "level": "intermediate",
  "visibility": "public",
  "topics": ["Refactoring", "Design Patterns"],
  "tags": ["typescript", "patterns"]
}
```

### Resource Actions
- `GET /api/resources/:id`: Retrieve single resource details.
- `PATCH /api/resources/:id`: Update resource metadata (Creator only).
- `DELETE /api/resources/:id`: Permanently delete resource (Creator only).
- `POST /api/resources/:id/like`: Toggle like state.
- `POST /api/resources/:id/save`: Toggle bookmark / saved state.
- `POST /api/resources/:id/view`: Increment view counter.

---

## 7. Discussions & Q&A (`/api/discussions`)

### List Discussions
`GET /api/discussions` (Protected)

**Query Parameters:**
- `search`, `subject`, `status` (`open` | `resolved` | `archived`), `hasAcceptedAnswer` (`true` | `false`), `sort` (`newest` | `popular` | `unanswered` | `views`), `page`, `limit`.

### Create Discussion Post
`POST /api/discussions` (Protected)

**Request Body:**
```json
{
  "title": "Why does useEffect run twice in React 18 Strict Mode?",
  "content": "I am observing duplicate API requests when mounting my component in local development mode. What is the intended behavior and best pattern to mitigate this?",
  "subject": "Web Development",
  "topics": ["React", "Lifecycle"],
  "tags": ["react18", "strictmode"]
}
```

### Discussion Actions
- `GET /api/discussions/:id`: Retrieve thread with answers and authors.
- `PATCH /api/discussions/:id`: Update discussion title, content, or status (Author only).
- `DELETE /api/discussions/:id`: Delete discussion (Author only).
- `POST /api/discussions/:id/vote`: Toggle upvote on discussion post.
- `POST /api/discussions/:id/view`: Increment view counter.

### Answers Management
- `POST /api/discussions/:id/answers`: Post an answer (5–5000 characters).
- `PATCH /api/discussions/:id/answers/:answerId`: Edit own answer (Author only).
- `DELETE /api/discussions/:id/answers/:answerId`: Delete own answer (Author only).
- `POST /api/discussions/:id/answers/:answerId/vote`: Upvote an answer.
- `POST /api/discussions/:id/answers/:answerId/accept`: Mark an answer as accepted (Discussion author only; automatically sets discussion status to `resolved`).

---

## 8. Direct Messaging & WebSockets (`/api/messages`)

### REST Endpoints
- `GET /api/messages/conversations`: List active conversations for the authenticated student.
- `POST /api/messages/conversations/direct`: Create or reuse existing 1-on-1 direct conversation.
  - Body: `{ "participantId": "<target_user_id>" }`
- `GET /api/messages/conversations/:conversationId`: Fetch conversation metadata (Participants only).
- `GET /api/messages/conversations/:conversationId/messages`: Fetch conversation history (Participants only).
- `POST /api/messages/conversations/:conversationId/messages`: Send direct message (Max 3000 chars; notifies via Socket.io).
- `POST /api/messages/conversations/:conversationId/read`: Mark all messages as read by caller.

### Real-Time WebSocket Events (Socket.io)

**Connection:**
Connect with token in auth payload:
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: 'Bearer <jwt>' }
});
```

**Client Emits:**
| Event | Payload | Description |
|---|---|---|
| `join_conversation` | `conversationId` | Joins private conversation room |
| `leave_conversation` | `conversationId` | Leaves conversation room |
| `send_message` | `{ conversationId, content }` | Transmits real-time message |
| `typing_start` | `{ conversationId }` | Broadcasts student is typing |
| `typing_stop` | `{ conversationId }` | Broadcasts student stopped typing |
| `message_read` | `{ conversationId }` | Marks messages read and broadcasts |

**Server Emits:**
| Event | Payload | Description |
|---|---|---|
| `new_message` | Message document | Delivered to room on message creation |
| `user_typing` | `{ userId, conversationId }` | Delivered to room when peer types |
| `user_stopped_typing` | `{ userId, conversationId }` | Delivered when peer stops typing |
| `messages_read` | `{ conversationId, readerId, readAt }` | Delivered when peer reads messages |

