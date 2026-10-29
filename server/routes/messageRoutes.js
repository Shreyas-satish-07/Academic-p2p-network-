import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getConversations,
  createDirectConversation,
  getConversationById,
  getMessages,
  sendMessage,
  markConversationAsRead,
} from '../controllers/messageController.js';

const router = express.Router();

// Require JWT authentication for all messaging endpoints
router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations/direct', createDirectConversation);

router.get('/conversations/:conversationId', getConversationById);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);
router.post('/conversations/:conversationId/read', markConversationAsRead);

export default router;

