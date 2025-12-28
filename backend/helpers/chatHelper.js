const { query } = require('../config/database');

/**
 * Create a new chat
 */
const createChat = async (name, type, createdBy) => {
  const result = await query(
    `INSERT INTO chats (name, type, created_by)
     VALUES ($1, $2, $3)
     RETURNING id, name, type, created_by, created_at, updated_at`,
    [name, type, createdBy]
  );
  return result.rows[0];
};

/**
 * Get chat by ID
 */
const getChatById = async (chatId) => {
  const result = await query(
    'SELECT id, name, type, created_by, created_at, updated_at FROM chats WHERE id = $1',
    [chatId]
  );
  return result.rows[0];
};

/**
 * Get all chats for a user
 */
const getUserChats = async (userId) => {
  const result = await query(
    `SELECT 
       c.id, c.name, c.type, c.created_by, c.created_at, c.updated_at,
       cp.last_read_at
     FROM chats c
     INNER JOIN chat_participants cp ON c.id = cp.chat_id
     WHERE cp.user_id = $1
     ORDER BY c.updated_at DESC`,
    [userId]
  );
  return result.rows;
};

/**
 * Add participant to chat
 */
const addParticipant = async (chatId, userId) => {
  const result = await query(
    `INSERT INTO chat_participants (chat_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (chat_id, user_id) DO NOTHING
     RETURNING id, chat_id, user_id, joined_at`,
    [chatId, userId]
  );
  return result.rows[0];
};

/**
 * Remove participant from chat
 */
const removeParticipant = async (chatId, userId) => {
  await query(
    'DELETE FROM chat_participants WHERE chat_id = $1 AND user_id = $2',
    [chatId, userId]
  );
};

/**
 * Check if user is participant
 */
const isParticipant = async (chatId, userId) => {
  const result = await query(
    'SELECT * FROM chat_participants WHERE chat_id = $1 AND user_id = $2',
    [chatId, userId]
  );
  return result.rows.length > 0;
};

/**
 * Get chat participants
 */
const getChatParticipants = async (chatId) => {
  const result = await query(
    `SELECT 
       u.id, u.username, u.email, u.avatar_url, u.status,
       cp.joined_at, cp.last_read_at
     FROM chat_participants cp
     INNER JOIN users u ON cp.user_id = u.id
     WHERE cp.chat_id = $1`,
    [chatId]
  );
  return result.rows;
};

/**
 * Update chat (triggers updated_at automatically via trigger)
 */
const updateChat = async (chatId, name) => {
  const result = await query(
    `UPDATE chats 
     SET name = $1
     WHERE id = $2
     RETURNING id, name, type, created_by, created_at, updated_at`,
    [name, chatId]
  );
  return result.rows[0];
};

/**
 * Delete chat
 */
const deleteChat = async (chatId) => {
  await query('DELETE FROM chats WHERE id = $1', [chatId]);
};

module.exports = {
  createChat,
  getChatById,
  getUserChats,
  addParticipant,
  removeParticipant,
  isParticipant,
  getChatParticipants,
  updateChat,
  deleteChat
};

