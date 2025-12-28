const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createChat,
  getUserChats,
  getChat,
  updateChat,
  deleteChat,
  addParticipant,
  removeParticipant
} = require('../controllers/chatController');

/**
 * @route   POST /api/chats
 * @desc    Create a new chat
 * @access  Private
 */
router.post('/', authenticate, createChat);

/**
 * @route   GET /api/chats
 * @desc    Get user's chats
 * @access  Private
 */
router.get('/', authenticate, getUserChats);

/**
 * @route   GET /api/chats/:chatId
 * @desc    Get chat by ID
 * @access  Private
 */
router.get('/:chatId', authenticate, getChat);

/**
 * @route   PUT /api/chats/:chatId
 * @desc    Update chat
 * @access  Private
 */
router.put('/:chatId', authenticate, updateChat);

/**
 * @route   DELETE /api/chats/:chatId
 * @desc    Delete chat
 * @access  Private
 */
router.delete('/:chatId', authenticate, deleteChat);

/**
 * @route   POST /api/chats/:chatId/participants
 * @desc    Add participant to chat
 * @access  Private
 */
router.post('/:chatId/participants', authenticate, addParticipant);

/**
 * @route   DELETE /api/chats/:chatId/participants/:userId
 * @desc    Remove participant from chat
 * @access  Private
 */
router.delete('/:chatId/participants/:userId', authenticate, removeParticipant);

module.exports = router;

