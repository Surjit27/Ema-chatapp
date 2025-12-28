const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { query } = require('../config/database');

/**
 * Middleware to authenticate requests using JWT
 * Adds req.user with user information if authenticated
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided. Please login first.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const userResult = await query(
      'SELECT id, username, email, avatar_url, status, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'User not found'
      });
    }

    // Attach user to request object
    req.user = userResult.rows[0];
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: error.message || 'Invalid or expired token'
    });
  }
};

module.exports = {
  authenticate
};

