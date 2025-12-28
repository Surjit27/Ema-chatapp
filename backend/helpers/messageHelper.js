const { query } = require('../config/database');

/**
 * Create a new message
 */
const createMessage = async (chatId, senderId, content, messageType = 'text') => {
  const result = await query(
    `INSERT INTO messages (chat_id, sender_id, content, message_type)
     VALUES ($1, $2, $3, $4)
     RETURNING id, chat_id, sender_id, content, message_type, is_edited, is_deleted, created_at, updated_at`,
    [chatId, senderId, content, messageType]
  );
  return result.rows[0];
};

/**
 * Get message by ID
 */
const getMessageById = async (messageId) => {
  const result = await query(
    `SELECT id, chat_id, sender_id, content, message_type, is_edited, is_deleted, created_at, updated_at
     FROM messages
     WHERE id = $1`,
    [messageId]
  );
  return result.rows[0];
};

/**
 * Get messages for a chat
 */
const getChatMessages = async (chatId, limit = 50, offset = 0) => {
  const result = await query(
    `SELECT 
       m.id, m.chat_id, m.sender_id, m.content, m.message_type, 
       m.is_edited, m.is_deleted, m.created_at, m.updated_at,
       u.id as sender_id, u.username, u.email, u.avatar_url
     FROM messages m
     INNER JOIN users u ON m.sender_id = u.id
     WHERE m.chat_id = $1 AND m.is_deleted = false
     ORDER BY m.created_at DESC
     LIMIT $2 OFFSET $3`,
    [chatId, limit, offset]
  );
  return result.rows.reverse(); // Reverse to show oldest first
};

/**
 * Update message
 */
const updateMessage = async (messageId, content) => {
  const result = await query(
    `UPDATE messages 
     SET content = $1, is_edited = true, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, chat_id, sender_id, content, message_type, is_edited, is_deleted, created_at, updated_at`,
    [content, messageId]
  );
  return result.rows[0];
};

/**
 * Delete message (soft delete)
 */
const deleteMessage = async (messageId) => {
  const result = await query(
    `UPDATE messages 
     SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, chat_id, sender_id, content, message_type, is_edited, is_deleted, created_at, updated_at`,
    [messageId]
  );
  return result.rows[0];
};

/**
 * Mark message as read
 */
const markMessageAsRead = async (messageId, userId) => {
  await query(
    `INSERT INTO message_reads (message_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (message_id, user_id) DO NOTHING`,
    [messageId, userId]
  );
};

/**
 * Get unread message count for a chat
 */
const getUnreadCount = async (chatId, userId) => {
  const result = await query(
    `SELECT COUNT(*) as count
     FROM messages m
     LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = $2
     WHERE m.chat_id = $1 
       AND m.sender_id != $2
       AND m.is_deleted = false
       AND mr.id IS NULL`,
    [chatId, userId]
  );
  return parseInt(result.rows[0].count);
};

module.exports = {
  createMessage,
  getMessageById,
  getChatMessages,
  updateMessage,
  deleteMessage,
  markMessageAsRead,
  getUnreadCount
};

