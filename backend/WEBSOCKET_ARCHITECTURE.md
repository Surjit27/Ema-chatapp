# WebSocket-Based Chat Backend Architecture

## 🏗️ How It Works

Our chat app uses **Socket.io** (built on WebSockets) for real-time, bidirectional communication between clients and server.

## 📊 Architecture Overview

```
┌─────────────┐         WebSocket         ┌─────────────┐
│   Client 1  │◄─────────────────────────►│             │
│  (React)    │                           │   Node.js   │
└─────────────┘                           │   Server    │
                                           │             │
┌─────────────┐         WebSocket         │  Socket.io  │
│   Client 2  │◄─────────────────────────►│   Handler   │
│  (React)    │                           │             │
└─────────────┘                           └──────┬──────┘
                                                   │
┌─────────────┐         WebSocket         ┌───────▼──────┐
│   Client 3  │◄─────────────────────────►│  PostgreSQL │
│  (React)    │                           │  Database   │
└─────────────┘                           └─────────────┘
```

## 🔄 Real-Time Flow

### 1. **Connection Flow**
```
Client → Server: Connect with JWT token
Server → Database: Verify user & get chats
Server → Client: Connection established
Server → All Clients: User is online
```

### 2. **Message Sending Flow**
```
Client A → Server: message:send { chatId, content }
Server → Database: Save message
Server → Database: Get sender info
Server → All Clients in chat room: message:new { message }
```

### 3. **Typing Indicator Flow**
```
Client A → Server: typing:start { chatId }
Server → Other Clients in chat: typing:start { userId, username }
Client A → Server: typing:stop { chatId }
Server → Other Clients: typing:stop { userId }
```

## 🎯 Key Components

### 1. **Server Setup** (`server.js`)
```javascript
// Creates HTTP server
const server = http.createServer(app);

// Attaches Socket.io to HTTP server
const io = new Server(server, { cors: {...} });

// Initializes WebSocket handler
socketHandler(io);
```

### 2. **Socket Handler** (`socket/socketHandler.js`)
- **Authentication Middleware**: Validates JWT token on connection
- **Connection Management**: Tracks active users
- **Room Management**: Auto-joins users to their chat rooms
- **Event Handlers**: Processes all WebSocket events

### 3. **Room System**
Socket.io uses "rooms" to group connections:
- `user:{userId}` - Personal room for direct notifications
- `chat:{chatId}` - Chat room for all participants

## 🔌 Event System

### **Client → Server Events** (What clients send)

| Event | Purpose | Data |
|-------|---------|------|
| `chat:join` | Join a chat room | `{ chatId }` |
| `chat:leave` | Leave a chat room | `{ chatId }` |
| `message:send` | Send a message | `{ chatId, content, messageType }` |
| `message:read` | Mark message as read | `{ messageId, chatId }` |
| `typing:start` | User started typing | `{ chatId }` |
| `typing:stop` | User stopped typing | `{ chatId }` |

### **Server → Client Events** (What server broadcasts)

| Event | Purpose | Data |
|-------|---------|------|
| `message:new` | New message received | `{ id, chat_id, content, sender, ... }` |
| `user:status` | User online/offline | `{ userId, status }` |
| `typing:start` | Someone is typing | `{ chatId, userId, username }` |
| `typing:stop` | Someone stopped typing | `{ chatId, userId }` |
| `message:read` | Message was read | `{ messageId, userId, chatId }` |
| `error` | Error occurred | `{ message }` |

## 🔐 Security Features

1. **JWT Authentication**: Every connection requires valid JWT token
2. **User Verification**: Server verifies user exists in database
3. **Participant Validation**: Only chat participants can send/receive messages
4. **Room Isolation**: Users only receive messages from chats they're in

## 💾 Database Integration

WebSocket handler directly interacts with PostgreSQL:

1. **On Connect**: 
   - Updates user status to 'online'
   - Fetches user's chats
   - Joins user to all their chat rooms

2. **On Message Send**:
   - Saves message to `messages` table
   - Fetches sender info
   - Updates chat `updated_at` timestamp

3. **On Message Read**:
   - Inserts into `message_reads` table
   - Updates `chat_participants.last_read_at`

4. **On Disconnect**:
   - Updates user status to 'offline'

## 🚀 Advantages of WebSocket Approach

### ✅ **Real-Time Communication**
- Messages appear instantly (no polling needed)
- Low latency (< 100ms typically)

### ✅ **Efficient**
- Persistent connection (no HTTP overhead per message)
- Bidirectional (server can push to clients)

### ✅ **Rich Features**
- Typing indicators
- Online/offline status
- Read receipts
- Live notifications

### ✅ **Scalable**
- Socket.io handles reconnection automatically
- Can scale horizontally with Redis adapter (future)

## 📝 Example: Complete Message Flow

```javascript
// 1. User A sends message
socket.emit('message:send', {
  chatId: 'abc-123',
  content: 'Hello!',
  messageType: 'text'
});

// 2. Server processes:
//    - Validates user is participant
//    - Saves to database
//    - Gets sender info
//    - Broadcasts to chat room

// 3. All participants (including User A) receive:
socket.on('message:new', (message) => {
  // message = {
  //   id: 'msg-456',
  //   chat_id: 'abc-123',
  //   content: 'Hello!',
  //   sender: { id: 'user-a', username: 'Alice' },
  //   created_at: '2024-01-01T12:00:00Z'
  // }
  // Update UI with new message
});
```

## 🔄 Connection Lifecycle

```
1. Client connects → Authenticate with JWT
2. Server validates → Loads user & chats
3. User joins rooms → Ready to send/receive
4. Real-time events → Messages, typing, status
5. Client disconnects → Update status to offline
```

## 🎯 Current Implementation Status

✅ **Completed:**
- WebSocket server setup
- JWT authentication
- Real-time messaging
- Typing indicators
- Read receipts
- User status tracking
- Room management
- Database integration

🚧 **Future Enhancements:**
- File/image upload via WebSocket
- Voice/video call signaling
- Message reactions
- Message editing via WebSocket
- Redis adapter for horizontal scaling

## 📚 Related Files

- `backend/server.js` - Server setup with Socket.io
- `backend/socket/socketHandler.js` - Main WebSocket logic
- `backend/socket/README.md` - API documentation
- `backend/config/database.js` - Database connection

