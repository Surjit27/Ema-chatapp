const messageHelper = require('../helpers/messageHelper');
const chatHelper = require('../helpers/chatHelper');
const userHelper = require('../helpers/userHelper');

/**
 * Send a message
 */
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = 'text' } = req.body;
    const userId = req.userId;

    // Validate input
    if (!content || content.trim() === '') {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Message content is required'
      });
    }

    // Check if user is participant
    const isUserParticipant = await chatHelper.isParticipant(chatId, userId);
    if (!isUserParticipant) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not a participant of this chat'
      });
    }

    // Create message
    const message = await messageHelper.createMessage(chatId, userId, content, messageType);

    // Get sender info
    const sender = await userHelper.getUserById(userId);

    // Update chat's updated_at
    await chatHelper.getChatById(chatId); // This will trigger updated_at

    res.status(201).json({
      message: 'Message sent successfully',
      data: {
        ...message,
        sender: {
          id: sender.id,
          username: sender.username,
          email: sender.email,
          avatar_url: sender.avatar_url
        }
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: error.message
    });
  }
};

/**
 * Get messages for a chat
 */
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    // Check if user is participant
    const isUserParticipant = await chatHelper.isParticipant(chatId, userId);
    if (!isUserParticipant) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not a participant of this chat'
      });
    }

    // Get messages
    const messages = await messageHelper.getChatMessages(chatId, limit, offset);

    // Format messages with sender info
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      chat_id: msg.chat_id,
      content: msg.content,
      message_type: msg.message_type,
      is_edited: msg.is_edited,
      is_deleted: msg.is_deleted,
      created_at: msg.created_at,
      updated_at: msg.updated_at,
      sender: {
        id: msg.sender_id,
        username: msg.username,
        email: msg.email,
        avatar_url: msg.avatar_url
      }
    }));

    res.json({
      messages: formattedMessages,
      count: formattedMessages.length
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      error: 'Failed to get messages',
      message: error.message
    });
  }
};

/**
 * Update a message
 */
const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    // Validate input
    if (!content || content.trim() === '') {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Message content is required'
      });
    }

    // Get message
    const message = await messageHelper.getMessageById(messageId);
    if (!message) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only edit your own messages'
      });
    }

    // Update message
    const updatedMessage = await messageHelper.updateMessage(messageId, content);

    // Get sender info
    const sender = await userHelper.getUserById(userId);

    res.json({
      message: 'Message updated successfully',
      data: {
        ...updatedMessage,
        sender: {
          id: sender.id,
          username: sender.username,
          email: sender.email,
          avatar_url: sender.avatar_url
        }
      }
    });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({
      error: 'Failed to update message',
      message: error.message
    });
  }
};

/**
 * Delete a message
 */
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    // Get message
    const message = await messageHelper.getMessageById(messageId);
    if (!message) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own messages'
      });
    }

    // Delete message (soft delete)
    await messageHelper.deleteMessage(messageId);

    res.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      error: 'Failed to delete message',
      message: error.message
    });
  }
};

/**
 * Mark message as read
 */
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    // Get message
    const message = await messageHelper.getMessageById(messageId);
    if (!message) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Message not found'
      });
    }

    // Check if user is participant
    const isUserParticipant = await chatHelper.isParticipant(message.chat_id, userId);
    if (!isUserParticipant) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not a participant of this chat'
      });
    }

    // Mark as read
    await messageHelper.markMessageAsRead(messageId, userId);

    res.json({
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      error: 'Failed to mark message as read',
      message: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  markAsRead
};

