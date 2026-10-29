# 🎓 Cohort — Academic Peer Collaboration Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A production-ready, academic-first collaboration network and learning management platform that empowers college students to discover compatible peers, organize study groups, share verified course materials, ask and answer academic questions, and collaborate via secure real-time direct messaging.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Configuration](#-environment-configuration)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Database Seeding](#-database-seeding)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [API Documentation](#-api-documentation)
- [Docker & Containerized Deployment](#-docker--containerized-deployment)
- [Security Hardening & Production Checklist](#-security-hardening--production-checklist)

---

## 🏛️ Architectural Overview

```
                      +---------------------------------------+
                      |           React 19 SPA Client         |
                      |    (Vite 8, Tailwind CSS, Axios)      |
                      +-------------------+-------------------+
                                          |
                        HTTP / REST       |       WebSocket (Socket.io)
                       (Bearer JWT)       |        (JWT Handshake)
                                          v
                      +-------------------+-------------------+
                      |          Express 5 Backend Server     |
                      |   - Helmet Security Headers           |
                      |   - Rate Limiting (express-rate-limit)|
                      |   - CORS & 1MB Body Limit Protection  |
                      |   - Centralized Error Handling        |
                      +---------+-------------------+---------+
                                |                   |
                                v                   v
                     +----------+----+     +--------+----------+
                     | MongoDB Atlas |     | Socket.io Engine  |
                     |  Mongoose ODM |     | Real-time Rooms   |
                     +---------------+     +-------------------+
```

---

## ✨ Key Features

### 1. 🔐 Robust Authentication & Session Hydration
- Stateless JSON Web Token (JWT) architecture with bcrypt password hashing (10 salt rounds).
- Safe user representations with strict password and internal metadata stripping.
- In-memory rate limiting on authentication routes (`/api/auth/login`, `/api/auth/register`) preventing brute-force attacks.
- Automatic session hydration via `GET /api/auth/me` with Axios 401 interceptor cleanup.

### 2. 🤝 Peer Discovery & Algorithmic Matchmaking (`/peers`)
- Compatibility matching engine calculating multi-factor compatibility scores (0–100%) based on overlapping engineering skills, interests, and academic level.
- Multi-criteria filtering by semester, department, skills, and availability schedules.

### 3. 👥 Collaborative Study Groups (`/study-groups`)
- Subject-based learning groups supporting online, offline, and hybrid meeting modes.
- Member capacity enforcement, role management (`owner`, `moderator`, `member`), and soft-deletion archiving.

### 4. 📚 Academic Resource Sharing Hub (`/resources`)
- Curated repository for study links, lecture slides, notes, and video tutorials.
- Granular visibility (`public` vs `private`), likes, bookmarks, and view counters.

### 5. 💬 Academic Discussions & Accepted Solutions (`/discussions`)
- Community Q&A forum with markdown support, voting, and view counts.
- Thread author answer acceptance mechanics with automatic thread resolution.

### 6. ⚡ Real-Time Direct Messaging (`/messages`)
- Direct 1-on-1 messaging powered by Socket.io and MongoDB persistence.
- Real-time active typing indicators, unread message badges, and delivery receipts.
- Automatic room cleanup and socket disconnection on student logout.

### 7. 🌓 Accessible Theme Engine
- Dark/light mode with pre-paint hydration to eliminate white flashes.
- Full contrast compliance, visible focus outlines, and responsive navigation drawers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19.2](https://react.dev/) with [Vite 8.2](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **HTTP Client**: [Axios 1.20](https://axios-http.com/)
- **Real-Time Client**: [Socket.io Client 4.8](https://socket.io/)
- **Icons & Animation**: [Lucide React](https://lucide.dev/) and [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5.1](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 8.19](https://mongoosejs.com/)
- **Real-Time Engine**: [Socket.io 4.8](https://socket.io/)
- **Security**: [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Logging**: [Morgan](https://github.com/expressjs/morgan)

### Testing & Tooling
- **Test Runner**: [Vitest 5.0](https://vitest.dev/)
- **API Assertions**: [Supertest](https://github.com/ladjs/supertest)
- **Linter**: [Oxlint 1.75](https://oxc.rs/docs/guide/usage/linter.html)
- **Containers**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 📁 Project Directory Structure

```text
Cohort/
├── docs/                       # Project documentation
│   └── API.md                  # Comprehensive REST & WebSocket API specification
├── server/                     # Express Backend Architecture
│   ├── config/
│   │   └── db.js               # MongoDB connection with retry loop
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── discussionController.js
│   │   ├── messageController.js
│   │   ├── resourceController.js
│   │   ├── studyGroupController.js
│   │   └── userController.js
│   ├── middleware/             # Express middlewares
│   │   ├── authMiddleware.js   # JWT authentication & route protection
│   │   └── errorMiddleware.js  # Centralized error & 404 handler
│   ├── models/                 # Mongoose data schemas
│   │   ├── Conversation.js
│   │   ├── Discussion.js
│   │   ├── Message.js
│   │   ├── Resource.js
│   │   ├── StudyGroup.js
│   │   └── User.js
│   ├── routes/                 # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── discussionRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── resourceRoutes.js
│   │   ├── studyGroupRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/                # Database seed scripts
│   │   ├── seedUsers.js
│   │   ├── seedStudyGroups.js
│   │   ├── seedResources.js
│   │   ├── seedDiscussions.js
│   │   └── seedMessages.js
│   ├── socket/
│   │   └── socketServer.js     # Socket.io connection & room management
│   ├── tests/                  # Backend test suites (Vitest + Supertest)
│   │   ├── auth.test.js
│   │   ├── authorization.test.js
│   │   ├── features.smoke.test.js
│   │   ├── profiles.test.js
│   │   └── testHelper.js
│   ├── .env.example            # Backend environment template
│   ├── Dockerfile              # Production Node Alpine containerfile
│   ├── package.json            # Server dependencies
│   └── server.js               # Express application entrypoint
├── src/                        # React Frontend Source
│   ├── components/             # Reusable UI & layout components
│   ├── context/                # React Contexts (AuthContext, ThemeContext)
│   ├── pages/                  # Top-level view pages
│   ├── services/               # API & Socket clients (api.js, socket.js)
│   ├── App.jsx                 # Route tree & navigation shell
│   └── main.jsx                # DOM mount & context provider wrapping
├── .env.example                # Frontend environment template
├── docker-compose.yml          # Multi-container orchestration (Mongo, Server, Client)
├── Dockerfile                  # Multi-stage client build with Nginx
├── nginx.conf                  # Production SPA reverse proxy configuration
├── package.json                # Root package configuration
├── vite.config.js              # Vite configuration
└── vitest.config.js            # Vitest test runner configuration
```

---

## ⚙️ Environment Configuration

### Client Configuration (`.env`)
Create a `.env` file in the project root:
```env
# URL to Express Backend REST API
VITE_API_BASE_URL=http://localhost:5000/api
```

### Server Configuration (`server/.env`)
Create a `server/.env` file:
```env
# Server Runtime Environment
NODE_ENV=development

# HTTP Server Port
PORT=5000

# MongoDB Connection String (Atlas URI or local mongod)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/cohort?retryWrites=true&w=majority

# JWT Authentication Secret (32+ characters)
JWT_SECRET=super_secret_jwt_signing_key_cohort_platform_2026

# JWT Expiration Period
JWT_EXPIRES_IN=7d

# Allowed Frontend Client Origin URL for CORS
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Getting Started & Local Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/cohort.git
cd cohort

# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment Files
```bash
# Root frontend environment
cp .env.example .env

# Backend environment
cp server/.env.example server/.env
# (Edit server/.env to insert your valid MongoDB Atlas connection string)
```

### 3. Run Development Servers

**Run Express Backend Server:**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Run React Frontend Development Server (in separate terminal):**
```bash
npm run dev
# Running on http://localhost:5173
```

---

## 💾 Database Seeding

Populate your database with rich, realistic student cohorts, study circles, materials, and discussions:

```bash
# 1. Seed Student Users & Profiles
npm run seed

# 2. Seed Study Groups
npm run seed:groups

# 3. Seed Learning Resources
npm run seed:resources

# 4. Seed Discussions & Answers
npm run seed:discussions

# 5. Seed Direct Conversations & Messages
npm run seed:messages
```

---

## 🧪 Testing & Quality Assurance

### Run Vitest Backend Integration Test Suites
```bash
npm test
```
Runs comprehensive test suites covering:
- **Authentication**: Registration, duplicate email rejection (409), login validation (401), `/api/auth/me` session hydration, malformed JWT rejection.
- **Profiles**: Fetching own profile, partial field updates, rejection of restricted field modifications (`email`, `password`, `role`, `_id`), boundary validation.
- **Authorization**: Verification that non-owners cannot edit or delete study groups, learning resources, or discussions; verification that third-party users cannot view private conversations.
- **Feature Smoke Tests**: Study group creation and join flow, resource creation and like/view mechanics, discussion posting with answer acceptance, direct message thread transmission.

### Code Quality & Linting
```bash
# Run lightning-fast Oxlint check across client and server
npm run lint
```

### Production Build Verification
```bash
# Verify client builds into production-optimized bundle
npm run build
```

---

## 📖 API Documentation

Complete REST and WebSocket specifications, request bodies, query filters, and response schemas are documented in [docs/API.md](file:///c:/MyLearning/AI_Project/Cohort/docs/API.md).

---

## 🐳 Docker & Containerized Deployment

Run the complete Cohort stack (MongoDB database, Express backend API, and Nginx-powered React client) locally with a single command:

```bash
# Build and start all three containers
docker compose up --build -d

# Check running status
docker compose ps

# View real-time logs
docker compose logs -f

# Stop all containers
docker compose down
```

### Service Map:
| Service | Container Name | Local Port | Description |
|---|---|---|---|
| `mongodb` | `cohort-mongodb` | `27017` | MongoDB 7.0 database with persistent volume |
| `server` | `cohort-backend` | `5000` | Express 5 Node.js API with health checks |
| `client` | `cohort-frontend` | `3000` | Production React SPA served via Nginx |

---

## 🛡️ Security Hardening & Production Checklist

1. **Secret Isolation**: All `.env` files are excluded in `.gitignore`. No credentials or JWT secrets are tracked in version control.
2. **Rate Limiting**: Critical authentication endpoints enforce 20 requests per 15-minute sliding window.
3. **Payload Sanitization**: `express.json({ limit: "1mb" })` limits body payloads to prevent denial-of-service via memory exhaustion.
4. **Data Masking**: Passwords are saved hashed with `select: false` and explicitly deleted in Mongoose schema `toJSON`/`toObject` transforms.
5. **CORS Hardening**: Strict CORS allows only the explicitly declared `CLIENT_URL`.
6. **Error Concealment**: Detailed error stack traces are hidden when `NODE_ENV === 'production'`.
7. **Clean Socket Teardown**: Sockets automatically disconnect on user logout or session expiration to prevent orphaned socket handles.
