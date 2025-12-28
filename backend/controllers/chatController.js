const chatHelper = require('../helpers/chatHelper');
const userHelper = require('../helpers/userHelper');

/**
 * Create a new chat
 */
const createChat = async (req, res) => {
  try {
    const { name, type = 'direct', participantIds } = req.body;
    const userId = req.userId;

    // Validate input
    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'At least one participant is required'
      });
    }

    // For group chats, name is required
    if (type === 'group' && (!name || name.trim() === '')) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Group chat name is required'
      });
    }

    // Create chat
    const chat = await chatHelper.createChat(name || null, type, userId);

    // Add creator as participant
    await chatHelper.addParticipant(chat.id, userId);

    // Add other participants
    for (const participantId of participantIds) {
      if (participantId !== userId) {
        // Verify user exists
        const user = await userHelper.getUserById(participantId);
        if (user) {
          await chatHelper.addParticipant(chat.id, participantId);
        }
      }
    }

    // Get chat with participants
    const participants = await chatHelper.getChatParticipants(chat.id);

    res.status(201).json({
      message: 'Chat created successfully',
      data: {
        ...chat,
        participants
      }
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      error: 'Failed to create chat',
      message: error.message
    });
  }
};

/**
 * Get user's chats
 */
const getUserChats = async (req, res) => {
  try {
    const userId = req.userId;

    const chats = await chatHelper.getUserChats(userId);

    // Get participants for each chat
    const chatsWithParticipants = await Promise.all(
      chats.map(async (chat) => {
        const participants = await chatHelper.getChatParticipants(chat.id);
        return {
          ...chat,
          participants
        };
      })
    );

    res.json({
      chats: chatsWithParticipants,
      count: chatsWithParticipants.length
    });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({
      error: 'Failed to get chats',
      message: error.message
    });
  }
};

/**
 * Get chat by ID
 */
const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    // Check if user is participant
    const isUserParticipant = await chatHelper.isParticipant(chatId, userId);
    if (!isUserParticipant) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not a participant of this chat'
      });
    }

    // Get chat
    const chat = await chatHelper.getChatById(chatId);
    if (!chat) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Chat not found'
      });
    }

    // Get participants
    const participants = await chatHelper.getChatParticipants(chatId);

    res.json({
      ...chat,
      participants
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      error: 'Failed to get chat',
      message: error.message
    });
  }
};

/**
 * Update chat
 */
const updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { name } = req.body;
    const userId = req.userId;

    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Chat name is required'
      });
    }

    // Get chat
    const chat = await chatHelper.getChatById(chatId);
    if (!chat) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Chat not found'
      });
    }

    // Check if user is creator (only creator can update)
    if (chat.created_by !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only chat creator can update the chat'
      });
    }

    // Update chat
    const updatedChat = await chatHelper.updateChat(chatId, name);

    res.json({
      message: 'Chat updated successfully',
      data: updatedChat
    });
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(500).json({
      error: 'Failed to update chat',
      message: error.message
    });
  }
};

/**
 * Delete chat
 */
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    // Get chat
    const chat = await chatHelper.getChatById(chatId);
    if (!chat) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Chat not found'
      });
    }

    // Check if user is creator (only creator can delete)
    if (chat.created_by !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only chat creator can delete the chat'
      });
    }

    // Delete chat
    await chatHelper.deleteChat(chatId);

    res.json({
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      error: 'Failed to delete chat',
      message: error.message
    });
  }
};

/**
 * Add participant to chat
 */
const addParticipant = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId: participantId } = req.body;
    const userId = req.userId;

    // Get chat
    const chat = await chatHelper.getChatById(chatId);
    if (!chat) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Chat not found'
      });
    }

    // Check if user is participant (to add others)
    const isUserParticipant = await chatHelper.isParticipant(chatId, userId);
    if (!isUserParticipant) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not a participant of this chat'
      });
    }

    // Verify participant exists
    const participant = await userHelper.getUserById(participantId);
    if (!participant) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    // Add participant
    await chatHelper.addParticipant(chatId, participantId);

    res.json({
      message: 'Participant added successfully'
    });
  } catch (error) {
    console.error('Add participant error:', error);
    res.status(500).json({
      error: 'Failed to add participant',
      message: error.message
    });
  }
};

/**
 * Remove participant from chat
 */
const removeParticipant = async (req, res) => {
  try {
    const { chatId, userId: participantId } = req.params;
    const userId = req.userId;

    // Get chat
    const chat = await chatHelper.getChatById(chatId);
    if (!chat) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Chat not found'
      });
    }

    // Check if user is creator or removing themselves
    if (chat.created_by !== userId && participantId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only chat creator can remove other participants'
      });
    }

    // Remove participant
    await chatHelper.removeParticipant(chatId, participantId);

    res.json({
      message: 'Participant removed successfully'
    });
  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({
      error: 'Failed to remove participant',
      message: error.message
    });
  }
};

module.exports = {
  createChat,
  getUserChats,
  getChat,
  updateChat,
  deleteChat,
  addParticipant,
  removeParticipant
};

