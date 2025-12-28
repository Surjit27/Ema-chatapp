const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Store active users and their socket connections
const activeUsers = new Map(); // userId -> socketId
const userSockets = new Map(); // socketId -> userId

// Socket.io authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists in database
    const userResult = await query('SELECT id, username, email, status FROM users WHERE id = $1', [decoded.userId]);
    
    if (userResult.rows.length === 0) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attach user info to socket
    socket.userId = decoded.userId;
    socket.user = userResult.rows[0];
    
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

const socketHandler = (io) => {
  // Socket.io middleware for authentication
  io.use(authenticateSocket);

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    const user = socket.user;

    console.log(`✅ User connected: ${user.username} (${userId})`);

    // Store user connection
    activeUsers.set(userId, socket.id);
    userSockets.set(socket.id, userId);

    // Update user status to online
    await query('UPDATE users SET status = $1 WHERE id = $2', ['online', userId]);

    // Join user to their personal room (for direct notifications)
    socket.join(`user:${userId}`);

    // Emit user online status to all connected clients
    io.emit('user:status', {
      userId,
      status: 'online'
    });

    // Get user's chats and join them to their chat rooms
    const chatsResult = await query(
      `SELECT c.id FROM chats c
       INNER JOIN chat_participants cp ON c.id = cp.chat_id
       WHERE cp.user_id = $1`,
      [userId]
    );

    chatsResult.rows.forEach(chat => {
      socket.join(`chat:${chat.id}`);
    });

    // Handle joining a chat room
    socket.on('chat:join', async (data) => {
      const { chatId } = data;
      
      // Verify user is a participant
      const participantResult = await query(
        'SELECT * FROM chat_participants WHERE chat_id = $1 AND user_id = $2',
        [chatId, userId]
      );

      if (participantResult.rows.length > 0) {
        socket.join(`chat:${chatId}`);
        socket.emit('chat:joined', { chatId });
        console.log(`User ${user.username} joined chat ${chatId}`);
      } else {
        socket.emit('error', { message: 'You are not a participant of this chat' });
      }
    });

    // Handle leaving a chat room
    socket.on('chat:leave', (data) => {
      const { chatId } = data;
      socket.leave(`chat:${chatId}`);
      socket.emit('chat:left', { chatId });
      console.log(`User ${user.username} left chat ${chatId}`);
    });

    // Handle sending a message
    socket.on('message:send', async (data) => {
      try {
        const { chatId, content, messageType = 'text' } = data;

        if (!chatId || !content) {
          return socket.emit('error', { message: 'Chat ID and content are required' });
        }

        // Verify user is a participant
        const participantResult = await query(
          'SELECT * FROM chat_participants WHERE chat_id = $1 AND user_id = $2',
          [chatId, userId]
        );

        if (participantResult.rows.length === 0) {
          return socket.emit('error', { message: 'You are not a participant of this chat' });
        }

        // Insert message into database
        const messageResult = await query(
          `INSERT INTO messages (chat_id, sender_id, content, message_type)
           VALUES ($1, $2, $3, $4)
           RETURNING id, chat_id, sender_id, content, message_type, created_at`,
          [chatId, userId, content, messageType]
        );

        const message = messageResult.rows[0];

        // Get sender info
        const senderResult = await query(
          'SELECT id, username, email, avatar_url FROM users WHERE id = $1',
          [userId]
        );

        const messageWithSender = {
          ...message,
          sender: senderResult.rows[0]
        };

        // Emit message to all participants in the chat room
        io.to(`chat:${chatId}`).emit('message:new', messageWithSender);

        // Update chat's updated_at timestamp
        await query(
          'UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
          [chatId]
        );

        console.log(`Message sent in chat ${chatId} by ${user.username}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing:start', (data) => {
      const { chatId } = data;
      socket.to(`chat:${chatId}`).emit('typing:start', {
        chatId,
        userId,
        username: user.username
      });
    });

    socket.on('typing:stop', (data) => {
      const { chatId } = data;
      socket.to(`chat:${chatId}`).emit('typing:stop', {
        chatId,
        userId
      });
    });

    // Handle message read receipt
    socket.on('message:read', async (data) => {
      try {
        const { messageId, chatId } = data;

        // Mark message as read
        await query(
          `INSERT INTO message_reads (message_id, user_id)
           VALUES ($1, $2)
           ON CONFLICT (message_id, user_id) DO NOTHING`,
          [messageId, userId]
        );

        // Update last_read_at for chat participant
        await query(
          `UPDATE chat_participants
           SET last_read_at = CURRENT_TIMESTAMP
           WHERE chat_id = $1 AND user_id = $2`,
          [chatId, userId]
        );

        // Notify other participants
        socket.to(`chat:${chatId}`).emit('message:read', {
          messageId,
          userId,
          chatId
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${user.username} (${userId})`);

      // Remove from active users
      activeUsers.delete(userId);
      userSockets.delete(socket.id);

      // Update user status to offline
      await query('UPDATE users SET status = $1 WHERE id = $2', ['offline', userId]);

      // Emit user offline status
      io.emit('user:status', {
        userId,
        status: 'offline'
      });
    });
  });

  return io;
};

module.exports = socketHandler;

