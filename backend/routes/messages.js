const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  markAsRead
} = require('../controllers/messageController');

/**
 * @route   POST /api/chats/:chatId/messages
 * @desc    Send a message
 * @access  Private
 */
router.post('/chats/:chatId/messages', authenticate, sendMessage);

/**
 * @route   GET /api/chats/:chatId/messages
 * @desc    Get messages for a chat
 * @access  Private
 */
router.get('/chats/:chatId/messages', authenticate, getMessages);

/**
 * @route   PUT /api/messages/:messageId
 * @desc    Update a message
 * @access  Private
 */
router.put('/messages/:messageId', authenticate, updateMessage);

/**
 * @route   DELETE /api/messages/:messageId
 * @desc    Delete a message
 * @access  Private
 */
router.delete('/messages/:messageId', authenticate, deleteMessage);

/**
 * @route   POST /api/messages/:messageId/read
 * @desc    Mark message as read
 * @access  Private
 */
router.post('/messages/:messageId/read', authenticate, markAsRead);

module.exports = router;

