import React, { useState } from 'react'
import { userAPI } from '../services/api'
import './ChatList.css'

const ChatList = ({ chats, selectedChat, onSelectChat, onCreateChat, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.trim().length > 0) {
      try {
        const response = await userAPI.search(query)
        setSearchResults(response.data.users || [])
        setShowSearch(true)
      } catch (err) {
        console.error('Search error:', err)
      }
    } else {
      setShowSearch(false)
    }
  }

  const handleSelectUser = (user) => {
    onCreateChat(user.id)
    setSearchQuery('')
    setShowSearch(false)
  }

  // Get display name for a chat
  const getChatDisplayName = (chat) => {
    // If chat has a name (group chat), use it
    if (chat.name) {
      return chat.name
    }
    
    // For direct chats, find the other participant
    if (chat.participants && chat.participants.length > 0 && currentUser) {
      // Find participant that is not the current user
      const otherParticipant = chat.participants.find(
        p => p.id !== currentUser.id
      )
      
      if (otherParticipant) {
        return otherParticipant.username
      }
      
      // If only one participant (current user), show "You"
      if (chat.participants.length === 1) {
        return 'You'
      }
    }
    
    // Fallback
    return 'Chat'
  }
  
  // Get avatar letter for a chat
  const getChatAvatarLetter = (chat) => {
    const displayName = getChatDisplayName(chat)
    return displayName[0].toUpperCase()
  }

  return (
    <div className="chat-list">
      <div className="chat-search">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {showSearch && (
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map(user => (
                <div
                  key={user.id}
                  className="search-result-item"
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="user-avatar">{user.username[0].toUpperCase()}</div>
                  <div className="user-info">
                    <div className="user-name">{user.username}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">No users found</div>
            )}
          </div>
        )}
      </div>

      <div className="chat-items">
        {chats.length > 0 ? (
          chats.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="chat-avatar">
                {getChatAvatarLetter(chat)}
              </div>
              <div className="chat-info">
                <div className="chat-name">{getChatDisplayName(chat)}</div>
                <div className="chat-preview">
                  {chat.type === 'group' && chat.participants?.length > 0 && (
                    <span>{chat.participants.length} participants</span>
                  )}
                  {chat.type === 'direct' && chat.participants?.length > 0 && (
                    <span className="user-status-indicator">
                      {chat.participants.find(p => p.id !== currentUser?.id)?.status || 'offline'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-chats">No chats yet. Search for users to start a chat!</div>
        )}
      </div>
    </div>
  )
}

export default ChatList

