import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { getIO, formatMessagePayload } from '../socket/socketServer.js';

/**
 * Format human-friendly time for conversation list (e.g. "10:45 AM" or "Yesterday")
 */
const formatConversationTime = (dateObj) => {
  if (!dateObj) return 'Just now';
  try {
    const d = new Date(dateObj);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Just now';
  }
};

/**
 * Format safe participant user object
 */
export const formatSafeUser = (userDoc) => {
  if (!userDoc) return null;
  const u = typeof userDoc.toObject === 'function' ? userDoc.toObject() : userDoc;
  const name = u.name || 'Cohort Student';
  const initials =
    u.initials ||
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('');
  return {
    id: (u._id || u.id)?.toString(),
    _id: (u._id || u.id)?.toString(),
    name,
    initials,
    department: u.department || '',
    semester: u.semester || null,
    avatar: u.avatar || { url: '' },
    avatarColor: '#ffffff',
    avatarBg: 'var(--pine, #2f5d50)',
    role: 'Member',
  };
};

/**
 * Formats a conversation document with safe participant and unread count data
 */
export const formatConversationResponse = (convDoc, currentUserId, unreadCount = 0) => {
  if (!convDoc) return null;
  const conv = typeof convDoc.toObject === 'function' ? convDoc.toObject() : { ...convDoc };
  const currentUserIdStr = currentUserId ? currentUserId.toString() : '';

  const rawParticipants = Array.isArray(conv.participants) ? conv.participants : [];
  const safeMembers = rawParticipants.map((p) => formatSafeUser(p));

  // Determine conversation title and visual identity
  let name = conv.name || '';
  let initials = 'DM';
  let avatarColor = '#ffffff';
  let avatarBg = 'var(--pine, #2f5d50)';
  let otherParticipant = null;

  if (conv.type === 'direct') {
    // For direct chats, conversation name is the other participant's name
    const otherUser = safeMembers.find((m) => m.id !== currentUserIdStr) || safeMembers[0];
    if (otherUser) {
      otherParticipant = otherUser;
      name = otherUser.name;
      initials = otherUser.initials;
    } else {
      name = 'Direct Message';
    }
  } else {
    name = conv.name || 'Study Workspace';
    initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('');
  }

  const convId = (conv._id || conv.id)?.toString();
  const lastMsgContent = conv.lastMessage?.content || '';
  const lastMsgDate = conv.lastMessage?.sentAt || conv.updatedAt;

  return {
    id: convId,
    _id: convId,
    type: conv.type || 'direct',
    name,
    initials,
    avatarColor,
    avatarBg,
    isOnline: true,
    unreadCount: Number(unreadCount) || 0,
    lastMessage: lastMsgContent,
    lastMessageAt: formatConversationTime(lastMsgDate),
    rawLastMessageAt: lastMsgDate,
    memberCount: safeMembers.length,
    members: safeMembers,
    otherParticipant,
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
    messages: [],
    files: [],
    activity: [],
  };
};

/**
 * @desc    Get all conversations for the authenticated user
 * @route   GET /api/messages/conversations
 * @access  Private (Requires Bearer JWT)
 */
export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;

    // Fetch conversations where user is a participant
    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate('participants', 'name initials department semester avatar')
      .populate('lastMessage.sender', 'name initials')
      .sort({ updatedAt: -1 });

    // Compute unread counts for each conversation
    const formattedList = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: currentUserId },
          'readBy.user': { $ne: currentUserId },
        });

        return formatConversationResponse(conv, currentUserId, unreadCount);
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Conversations fetched successfully',
      data: {
        conversations: formattedList,
      },
    });
  } catch (error) {
    console.error('getConversations error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching conversations.',
    });
  }
};

/**
 * @desc    Create or reuse a direct conversation with another student
 * @route   POST /api/messages/conversations/direct
 * @access  Private (Requires Bearer JWT)
 */
export const createDirectConversation = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { recipientId, participantId } = req.body;
    const targetUserId = recipientId || participantId;

    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid recipientId is required.',
      });
    }

    // Reject self-conversations
    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create a direct conversation with yourself.',
      });
    }

    // Verify recipient user exists
    const recipientUser = await User.findById(targetUserId);
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        message: 'Recipient student not found.',
      });
    }

    // Check for existing direct conversation between the same two users (reuse instead of duplicate)
    let conversation = await Conversation.findOne({
      type: 'direct',
      participants: { $all: [currentUserId, targetUserId], $size: 2 },
    })
      .populate('participants', 'name initials department semester avatar')
      .populate('lastMessage.sender', 'name initials');

    let statusCode = 200;

    if (!conversation) {
      // Create new direct conversation
      conversation = await Conversation.create({
        type: 'direct',
        participants: [currentUserId, targetUserId],
        lastMessage: {
          content: 'Conversation started.',
          sender: currentUserId,
          sentAt: new Date(),
        },
      });

      await conversation.populate('participants', 'name initials department semester avatar');
      statusCode = 201;
    }

    const unreadCount = await Message.countDocuments({
      conversation: conversation._id,
      sender: { $ne: currentUserId },
      'readBy.user': { $ne: currentUserId },
    });

    const formatted = formatConversationResponse(conversation, currentUserId, unreadCount);

    return res.status(statusCode).json({
      success: true,
      message: statusCode === 201 ? 'Direct conversation created' : 'Existing conversation reused',
      data: {
        conversation: formatted,
      },
    });
  } catch (error) {
    console.error('createDirectConversation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while initiating direct conversation.',
    });
  }
};

/**
 * @desc    Get a single conversation by ID
 * @route   GET /api/messages/conversations/:conversationId
 * @access  Private (Requires Bearer JWT)
 */
export const getConversationById = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID format.',
      });
    }

    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'name initials department semester avatar')
      .populate('lastMessage.sender', 'name initials');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.',
      });
    }

    // Membership check: authenticated user must be a participant
    const isParticipant = conversation.participants.some(
      (p) => (p._id || p)?.toString() === currentUserId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a participant in this conversation.',
      });
    }

    const unreadCount = await Message.countDocuments({
      conversation: conversation._id,
      sender: { $ne: currentUserId },
      'readBy.user': { $ne: currentUserId },
    });

    const formatted = formatConversationResponse(conversation, currentUserId, unreadCount);

    return res.status(200).json({
      success: true,
      message: 'Conversation fetched successfully',
      data: {
        conversation: formatted,
      },
    });
  } catch (error) {
    console.error('getConversationById error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching conversation.',
    });
  }
};

/**
 * @desc    Get chronological messages for a conversation
 * @route   GET /api/messages/conversations/:conversationId/messages
 * @access  Private (Requires Bearer JWT)
 */
export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { conversationId } = req.params;
    const { page = 1, limit = 100 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID format.',
      });
    }

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedPage) || parsedPage < 1 || isNaN(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive integers.',
      });
    }

    // Verify membership before returning messages
    const isParticipant = await Conversation.exists({
      _id: conversationId,
      participants: currentUserId,
    });

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a participant in this conversation.',
      });
    }

    const totalMessages = await Message.countDocuments({ conversation: conversationId });

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .populate('sender', 'name initials department semester avatar');

    const formattedMessages = messages.map((m) => formatMessagePayload(m, currentUserId));

    return res.status(200).json({
      success: true,
      message: 'Messages fetched successfully',
      data: {
        messages: formattedMessages,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total: totalMessages,
          totalPages: Math.ceil(totalMessages / parsedLimit),
        },
      },
    });
  } catch (error) {
    console.error('getMessages error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching messages.',
    });
  }
};

/**
 * @desc    Post a message to a conversation (REST fallback / direct POST)
 * @route   POST /api/messages/conversations/:conversationId/messages
 * @access  Private (Requires Bearer JWT)
 */
export const sendMessage = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID format.',
      });
    }

    const trimmedContent = (content || '').trim();
    if (!trimmedContent || trimmedContent.length > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required and cannot exceed 3000 characters.',
      });
    }

    // Verify membership
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: currentUserId,
    });

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a participant in this conversation.',
      });
    }

    // Create and save message
    const newMessage = await Message.create({
      conversation: conversationId,
      sender: currentUserId,
      content: trimmedContent,
      readBy: [
        {
          user: currentUserId,
          readAt: new Date(),
        },
      ],
    });

    // Update conversation lastMessage & updatedAt
    conversation.lastMessage = {
      content: trimmedContent,
      sender: currentUserId,
      sentAt: new Date(),
    };
    await conversation.save();

    await newMessage.populate('sender', 'name initials department semester avatar');

    const formatted = formatMessagePayload(newMessage, currentUserId);

    // If Socket.io is running, broadcast to the conversation room and user rooms
    const io = getIO();
    if (io) {
      io.to(conversationId).emit('message:new', {
        conversationId,
        message: formatted,
      });

      const participants = conversation.participants || [];
      for (const p of participants) {
        const pId = p.toString();
        io.to(`user:${pId}`).emit('conversation:updated', {
          conversationId,
          lastMessage: trimmedContent,
          lastMessageSenderId: currentUserId.toString(),
          updatedAt: conversation.updatedAt,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: formatted,
      },
    });
  } catch (error) {
    console.error('sendMessage error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while sending message.',
    });
  }
};

/**
 * @desc    Mark all unread messages in conversation as read
 * @route   POST /api/messages/conversations/:conversationId/read
 * @access  Private (Requires Bearer JWT)
 */
export const markConversationAsRead = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID format.',
      });
    }

    // Verify membership
    const isParticipant = await Conversation.exists({
      _id: conversationId,
      participants: currentUserId,
    });

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a participant in this conversation.',
      });
    }

    const readAt = new Date();

    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: currentUserId },
        'readBy.user': { $ne: currentUserId },
      },
      {
        $push: {
          readBy: {
            user: currentUserId,
            readAt,
          },
        },
      }
    );

    // Broadcast read event through Socket.io if running
    const io = getIO();
    if (io) {
      io.to(conversationId).emit('message:read', {
        conversationId,
        userId: currentUserId.toString(),
        readAt,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation messages marked as read.',
      data: {
        conversationId,
        readAt,
      },
    });
  } catch (error) {
    console.error('markConversationAsRead error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while marking conversation as read.',
    });
  }
};
