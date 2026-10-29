import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables before reading them
dotenv.config({ path: path.join(__dirname, '.env') });

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import studyGroupRoutes from './routes/studyGroupRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { initSocketServer } from './socket/socketServer.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser with payload limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// HTTP Request Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cohort API is running',
  });
});

// Mount Authentication Routes
app.use('/api/auth', authRoutes);

// Mount User & Profile Routes
app.use('/api/users', userRoutes);

// Mount Study Group Routes
app.use('/api/study-groups', studyGroupRoutes);

// Mount Learning Resource Routes
app.use('/api/resources', resourceRoutes);

// Mount Discussion Routes
app.use('/api/discussions', discussionRoutes);

// Mount Secure Messaging Routes
app.use('/api/messages', messageRoutes);

// Initialize Socket.io on the HTTP server
initSocketServer(httpServer, {
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST'],
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start listening
const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Cohort API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to initialize server: ${error.message}`);
    process.exit(1);
  }
};

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  startServer();
}

export { app, httpServer };
export default app;