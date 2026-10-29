import express from 'express';
import {
  getUsers,
  getMe,
  updateMe,
  getUserById,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected peer discovery endpoint
router.get('/', protect, getUsers);

// Protected profile routes for currently authenticated user
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);

// Protected public profile route for fetching peer student profiles
router.get('/:id', protect, getUserById);

export default router;
