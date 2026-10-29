import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

let ioInstance = null;

/**
 * Format relative / clock time for messages
 */
const formatMessageTime = (dateObj) => {
  if (!dateObj) return 'Just now';
  try {
    const d = new Date(dateObj);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Just now';
  }
};

/**
 * Format message for socket and REST output
 */
export const formatMessagePayload = (messageDoc, currentUserId) => {
  if (!messageDoc) return null;
  const msg = typeof messageDoc.toObject === 'function' ? messageDoc.toObject() : { ...messageDoc };
  const currentUserIdStr = currentUserId ? currentUserId.toString() : '';

  const senderObj = msg.sender && typeof msg.sender === 'object' ? msg.sender : null;
  const senderId = senderObj
    ? (senderObj._id || senderObj.id)?.toString()
    : msg.sender?.toString() || '';
  const senderName = senderObj?.name || 'Cohort Student';
  const senderInitials =
    senderObj?.initials ||
    senderName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('');

  const isCurrentUser = Boolean(currentUserIdStr && senderId === currentUserIdStr);
  const msgId = (msg._id || msg.id)?.toString();
  const convId = (msg.conversation?._id || msg.conversation)?.toString();

  const readByList = Array.isArray(msg.readBy) ? msg.readBy : [];
  const isReadByCurrentUser = readByList.some(
    (r) => (r.user?._id || r.user)?.toString() === currentUserIdStr
  );

  return {
    id: msgId,
    _id: msgId,
    conversationId: convId,
    content: msg.content || '',
    senderId,
    senderName,
    senderInitials,
    senderDepartment: senderObj?.department || '',
    senderAvatar: senderObj?.avatar || { url: '' },
    isCurrentUser,
    createdAt: formatMessageTime(msg.createdAt),
    rawCreatedAt: msg.createdAt,
    updatedAt: msg.updatedAt,
    readBy: readByList,
    isRead: isReadByCurrentUser,
    type: 'text',
  };
};

/**
 * Initialize Socket.io server on the existing HTTP server instance
 */
export const initSocketServer = (httpServer, corsOptions) => {
  ioInstance = new Server(httpServer, {
    cors: corsOptions || {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
  });

  // JWT Authentication Middleware for Socket Handshake
  ioInstance.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return next(new Error('Invalid token payload'));
      }

      const user = await User.findById(decoded.id).select('name email initials department semester avatar');
      if (!user) {
        return next(new Error('User not found'));
      }

      // Attach authenticated user information to socket
      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      return next(new Error('Authentication failed: ' + err.message));
    }
  });

  // Socket Connection & Event Listeners
  ioInstance.on('connection', (socket) => {
    // Automatically join the user to their private room for targeted notifications
    const userRoom = `user:${socket.userId}`;
    socket.join(userRoom);

    /**
     * Join conversation room
     * Event: conversation:join
     * Payload: { conversationId }
     */
    socket.on('conversation:join', async (data) => {
      try {
        const { conversationId } = data || {};
        if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
          return socket.emit('socket:error', { message: 'Invalid conversation ID' });
        }

        // Security check: verify authenticated user is a participant in this conversation
        const isParticipant = await Conversation.exists({
          _id: conversationId,
          participants: socket.userId,
        });

        if (!isParticipant) {
          return socket.emit('socket:error', {
            message: 'Access denied: You are not a participant in this conversation',
          });
        }

        socket.join(conversationId);
      } catch (err) {
        socket.emit('socket:error', { message: err.message });
      }
    });

    /**
     * Leave conversation room
     * Event: conversation:leave
     * Payload: { conversationId }
     */
    socket.on('conversation:leave', (data) => {
      try {
        const { conversationId } = data || {};
        if (conversationId) {
          socket.leave(conversationId);
        }
      } catch (err) {
        socket.emit('socket:error', { message: err.message });
      }
    });

    /**
     * Send message through socket
     * Event: message:send
     * Payload: { conversationId, content }
     */
    socket.on('message:send', async (data) => {
      try {
        const { conversationId, content } = data || {};

        if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
          return socket.emit('socket:error', { message: 'Invalid conversation ID' });
        }

        const trimmedContent = (content || '').trim();
        if (!trimmedContent || trimmedContent.length > 3000) {
          return socket.emit('socket:error', {
            message: 'Message content is required and cannot exceed 3000 characters',
          });
        }

        // Security check: verify membership
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: socket.userId,
        });

        if (!conversation) {
          return socket.emit('socket:error', {
            message: 'Access denied: You are not a participant in this conversation',
          });
        }

        // Create and persist message (NEVER trust sender from payload - always use socket.userId)
        const newMessage = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          content: trimmedContent,
          readBy: [
            {
              user: socket.userId,
              readAt: new Date(),
            },
          ],
        });

        // Update conversation lastMessage & timestamp
        conversation.lastMessage = {
          content: trimmedContent,
          sender: socket.userId,
          sentAt: new Date(),
        };
        await conversation.save();

        await newMessage.populate('sender', 'name initials department semester avatar');

        const messagePayload = formatMessagePayload(newMessage, socket.userId);

        // Broadcast to all participants in this conversation room
        ioInstance.to(conversationId).emit('message:new', {
          conversationId,
          message: messagePayload,
        });

        // Also broadcast conversation update to each participant's private user room
        const participants = conversation.participants || [];
        for (const p of participants) {
          const pId = p.toString();
          ioInstance.to(`user:${pId}`).emit('conversation:updated', {
            conversationId,
            lastMessage: trimmedContent,
            lastMessageSenderId: socket.userId,
            updatedAt: conversation.updatedAt,
          });
        }
      } catch (err) {
        socket.emit('socket:error', { message: err.message });
      }
    });

    /**
     * Mark conversation as read
     * Event: conversation:read
     * Payload: { conversationId }
     */
    socket.on('conversation:read', async (data) => {
      try {
        const { conversationId } = data || {};
        if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
          return socket.emit('socket:error', { message: 'Invalid conversation ID' });
        }

        // Security check: verify membership
        const isParticipant = await Conversation.exists({
          _id: conversationId,
          participants: socket.userId,
        });

        if (!isParticipant) {
          return socket.emit('socket:error', {
            message: 'Access denied: You are not a participant in this conversation',
          });
        }

        const readAt = new Date();

        // Mark unread messages in conversation as read for current user
        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: socket.userId },
            'readBy.user': { $ne: socket.userId },
          },
          {
            $push: {
              readBy: {
                user: socket.userId,
                readAt,
              },
            },
          }
        );

        // Emit read receipt event to conversation room
        ioInstance.to(conversationId).emit('message:read', {
          conversationId,
          userId: socket.userId,
          readAt,
        });
      } catch (err) {
        socket.emit('socket:error', { message: err.message });
      }
    });

    socket.on('disconnect', () => {
      // Clean up connection
    });
  });

  return ioInstance;
};

/**
 * Get the active Socket.io server instance
 */
export const getIO = () => {
  return ioInstance;
};
