import React, { useRef, useEffect } from 'react'
import './MessageList.css'

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="message-list">
      {messages.length > 0 ? (
        messages.map(message => {
          // Determine if message is from current user
          // Check both sender_id and sender.id for compatibility
          const messageSenderId = message.sender_id || message.sender?.id
          const isOwnMessage = currentUserId && messageSenderId === currentUserId
          
          return (
            <div
              key={message.id}
              className={`message ${isOwnMessage ? 'own' : 'other'}`}
            >
              <div className="message-content">
                {!isOwnMessage && (
                  <div className="message-sender">{message.sender?.username || 'User'}</div>
                )}
                <div className="message-text">{message.content}</div>
                <div className="message-time">
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="no-messages">
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList

