import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure server/.env is loaded
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cohort_test';
const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_32_characters_long_min!';

export const connectTestDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await mongoose.connect(MONGODB_URI);
      break;
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
};

export const disconnectTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

export const generateTestToken = (userId, role = 'student') => {
  return jwt.sign({ id: userId.toString(), role }, JWT_SECRET, { expiresIn: '1d' });
};

export const createTestUser = async (overrides = {}) => {
  const unique = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const defaultUserData = {
    name: `Test User ${unique}`,
    email: `test_user_${unique}@example.com`,
    password: 'Password123!',
    college: 'Engineering Institute of Technology',
    department: 'Computer Science',
    semester: 6,
    skills: ['JavaScript', 'React', 'Node.js'],
    interests: ['Web Development', 'Cloud Computing'],
    role: 'student',
    ...overrides,
  };

  const user = await User.create(defaultUserData);
  const token = generateTestToken(user._id, user.role);

  return {
    user,
    token,
    authHeader: { Authorization: `Bearer ${token}` },
  };
};

export { app, request, mongoose, User };

