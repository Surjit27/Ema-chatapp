const { query } = require('../config/database');

/**
 * Get user by ID
 */
const getUserById = async (userId) => {
  const result = await query(
    'SELECT id, username, email, avatar_url, status, created_at FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0];
};

/**
 * Get user by email
 */
const getUserByEmail = async (email) => {
  const result = await query(
    'SELECT id, username, email, avatar_url, status, created_at FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

/**
 * Search users by username or email
 */
const searchUsers = async (searchTerm, excludeUserId = null) => {
  let sql = `
    SELECT id, username, email, avatar_url, status, created_at 
    FROM users 
    WHERE (username ILIKE $1 OR email ILIKE $1)
  `;
  const params = [`%${searchTerm}%`];
  
  if (excludeUserId) {
    sql += ' AND id != $2';
    params.push(excludeUserId);
  }
  
  sql += ' LIMIT 20';
  
  const result = await query(sql, params);
  return result.rows;
};

module.exports = {
  getUserById,
  getUserByEmail,
  searchUsers
};

