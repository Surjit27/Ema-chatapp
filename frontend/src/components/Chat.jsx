import React, { useState, useEffect, useRef } from 'react'
import { chatAPI, messageAPI, userAPI, authAPI } from '../services/api'
import { connectSocket, disconnectSocket, getSocket } from '../services/socket'
import ChatList from './ChatList'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import './Chat.css'

const Chat = ({ onLogout }) => {
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadUser()
    loadChats()
    const token = localStorage.getItem('token')
    if (token) {
      connectSocket(token)
      setupSocketListeners()
    }

    return () => {
      disconnectSocket()
    }
  }, [])

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id)
      joinChatRoom(selectedChat.id)
    }
  }, [selectedChat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const setupSocketListeners = () => {
    const socket = getSocket()
    if (!socket) return

    socket.on('connect', () => {
      console.log('Connected to WebSocket')
    })

    socket.on('message:new', (message) => {
      if (selectedChat && message.chat_id === selectedChat.id) {
        setMessages(prev => [...prev, message])
      }
      // Refresh chat list to update last message
      loadChats()
    })

    socket.on('user:status', (data) => {
      // Update user status in chat list if needed
      console.log('User status:', data)
    })
  }

  const loadUser = async () => {
    try {
      const response = await authAPI.getMe()
      setCurrentUser(response.data.user)
    } catch (err) {
      console.error('Load user error:', err)
    }
  }

  const loadChats = async () => {
    try {
      const response = await chatAPI.getAll()
      setChats(response.data.chats || [])
      if (response.data.chats && response.data.chats.length > 0 && !selectedChat) {
        setSelectedChat(response.data.chats[0])
      }
    } catch (err) {
      console.error('Load chats error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (chatId) => {
    try {
      const response = await messageAPI.getMessages(chatId)
      setMessages(response.data.messages || [])
    } catch (err) {
      console.error('Load messages error:', err)
    }
  }

  const joinChatRoom = (chatId) => {
    const socket = getSocket()
    if (socket) {
      socket.emit('chat:join', { chatId })
    }
  }

  const handleSendMessage = async (content) => {
    if (!selectedChat || !content.trim()) return

    try {
      // Send via WebSocket for real-time
      const socket = getSocket()
      if (socket) {
        socket.emit('message:send', {
          chatId: selectedChat.id,
          content: content.trim(),
          messageType: 'text'
        })
      } else {
        // Fallback to REST API
        await messageAPI.send(selectedChat.id, {
          content: content.trim(),
          messageType: 'text'
        })
        loadMessages(selectedChat.id)
      }
    } catch (err) {
      console.error('Send message error:', err)
    }
  }

  const handleCreateChat = async (participantId) => {
    try {
      const response = await chatAPI.create({
        type: 'direct',
        participantIds: [participantId]
      })
      await loadChats()
      setSelectedChat(response.data.data)
    } catch (err) {
      console.error('Create chat error:', err)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-header">
          <div className="user-info-header">
            <div className="user-avatar-small">
              {currentUser?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <h2>{currentUser?.username || 'User'}</h2>
              <span className="user-status">Online</span>
            </div>
          </div>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onCreateChat={handleCreateChat}
          currentUser={currentUser}
        />
      </div>

      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-messages-header">
              <h3>
                {selectedChat.name || 
                 (selectedChat.participants?.find(p => p.id !== currentUser?.id)?.username) || 
                 'Chat'}
              </h3>
            </div>
            <MessageList messages={messages} currentUserId={currentUser?.id} />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="chat-empty">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat

