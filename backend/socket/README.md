# WebSocket Implementation

This directory contains Socket.io WebSocket handlers for real-time communication.

## 🔌 Socket Events

### Client → Server Events

#### Connection
- **Authentication**: Token should be sent in `socket.handshake.auth.token` or as Bearer token in headers

#### Chat Events
- `chat:join` - Join a chat room
  ```javascript
  socket.emit('chat:join', { chatId: 'uuid' });
  ```

- `chat:leave` - Leave a chat room
  ```javascript
  socket.emit('chat:leave', { chatId: 'uuid' });
  ```

#### Message Events
- `message:send` - Send a new message
  ```javascript
  socket.emit('message:send', {
    chatId: 'uuid',
    content: 'Hello!',
    messageType: 'text' // 'text', 'image', 'file'
  });
  ```

- `message:read` - Mark message as read
  ```javascript
  socket.emit('message:read', {
    messageId: 'uuid',
    chatId: 'uuid'
  });
  ```

#### Typing Events
- `typing:start` - User started typing
  ```javascript
  socket.emit('typing:start', { chatId: 'uuid' });
  ```

- `typing:stop` - User stopped typing
  ```javascript
  socket.emit('typing:stop', { chatId: 'uuid' });
  ```

### Server → Client Events

#### Connection Events
- `chat:joined` - Successfully joined a chat
  ```javascript
  socket.on('chat:joined', (data) => {
    console.log('Joined chat:', data.chatId);
  });
  ```

- `chat:left` - Successfully left a chat
  ```javascript
  socket.on('chat:left', (data) => {
    console.log('Left chat:', data.chatId);
  });
  ```

#### Message Events
- `message:new` - New message received
  ```javascript
  socket.on('message:new', (message) => {
    console.log('New message:', message);
    // message contains: id, chat_id, sender_id, content, message_type, created_at, sender (user object)
  });
  ```

- `message:read` - Message read receipt
  ```javascript
  socket.on('message:read', (data) => {
    console.log('Message read:', data.messageId, 'by user:', data.userId);
  });
  ```

#### Typing Events
- `typing:start` - Someone started typing
  ```javascript
  socket.on('typing:start', (data) => {
    console.log(data.username, 'is typing in chat', data.chatId);
  });
  ```

- `typing:stop` - Someone stopped typing
  ```javascript
  socket.on('typing:stop', (data) => {
    console.log('User', data.userId, 'stopped typing');
  });
  ```

#### User Status Events
- `user:status` - User online/offline status changed
  ```javascript
  socket.on('user:status', (data) => {
    console.log('User', data.userId, 'is now', data.status);
  });
  ```

#### Error Events
- `error` - Error occurred
  ```javascript
  socket.on('error', (error) => {
    console.error('Socket error:', error.message);
  });
  ```

## 🔐 Authentication

Socket.io connections require JWT authentication. The token should be provided in one of these ways:

1. **Via handshake auth:**
   ```javascript
   const socket = io('http://localhost:5000', {
     auth: {
       token: 'your-jwt-token'
     }
   });
   ```

2. **Via Authorization header:**
   ```javascript
   const socket = io('http://localhost:5000', {
     extraHeaders: {
       Authorization: 'Bearer your-jwt-token'
     }
   });
   ```

## 📝 Features

- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ Read receipts
- ✅ User online/offline status
- ✅ Automatic chat room joining
- ✅ JWT authentication
- ✅ Error handling

## 🚀 Usage Example (Frontend)

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token')
  }
});

// Listen for new messages
socket.on('message:new', (message) => {
  console.log('New message:', message);
  // Update UI with new message
});

// Send a message
socket.emit('message:send', {
  chatId: 'chat-uuid',
  content: 'Hello, world!',
  messageType: 'text'
});

// Join a chat
socket.emit('chat:join', { chatId: 'chat-uuid' });
```

