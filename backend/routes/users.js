const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const userHelper = require('../helpers/userHelper');

/**
 * @route   GET /api/users/search
 * @desc    Search users
 * @access  Private
 */
router.get('/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.userId;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Search query is required'
      });
    }

    const users = await userHelper.searchUsers(q, userId);

    res.json({
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      error: 'Failed to search users',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/users/:userId
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userHelper.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: error.message
    });
  }
});

module.exports = router;

