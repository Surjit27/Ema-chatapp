# API Structure - Simple & Organized

## 📁 File Organization

```
backend/
├── helpers/              # Database operations (simple functions)
│   ├── userHelper.js    # User database operations
│   ├── chatHelper.js    # Chat database operations
│   └── messageHelper.js # Message database operations
│
├── controllers/          # Business logic (uses helpers)
│   ├── authController.js    # Login, Register, Get Me
│   ├── chatController.js   # Chat CRUD operations
│   └── messageController.js # Message CRUD operations
│
├── routes/              # API endpoints (uses controllers)
│   ├── auth.js         # /api/auth/*
│   ├── users.js        # /api/users/*
│   ├── chats.js        # /api/chats/*
│   └── messages.js     # /api/messages/*
│
└── server.js           # Main server file
```

## 🔄 How It Works

### Flow:
```
Request → Route → Controller → Helper → Database → Response
```

### Example: Sending a Message
1. **Route** (`routes/messages.js`) - Receives POST request
2. **Controller** (`controllers/messageController.js`) - Validates, checks permissions
3. **Helper** (`helpers/messageHelper.js`) - Does database operation
4. **Response** - Returns message data

## 📋 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users (`/api/users`)
- `GET /api/users/search?q=username` - Search users (protected)
- `GET /api/users/:userId` - Get user by ID (protected)

### Chats (`/api/chats`)
- `POST /api/chats` - Create new chat (protected)
- `GET /api/chats` - Get user's chats (protected)
- `GET /api/chats/:chatId` - Get chat details (protected)
- `PUT /api/chats/:chatId` - Update chat (protected)
- `DELETE /api/chats/:chatId` - Delete chat (protected)
- `POST /api/chats/:chatId/participants` - Add participant (protected)
- `DELETE /api/chats/:chatId/participants/:userId` - Remove participant (protected)

### Messages (`/api`)
- `POST /api/chats/:chatId/messages` - Send message (protected)
- `GET /api/chats/:chatId/messages` - Get messages (protected)
- `PUT /api/messages/:messageId` - Update message (protected)
- `DELETE /api/messages/:messageId` - Delete message (protected)
- `POST /api/messages/:messageId/read` - Mark as read (protected)

## 🎯 Helper Files (Database Operations)

### `helpers/userHelper.js`
- `getUserById(userId)` - Get user by ID
- `getUserByEmail(email)` - Get user by email
- `searchUsers(searchTerm, excludeUserId)` - Search users

### `helpers/chatHelper.js`
- `createChat(name, type, createdBy)` - Create chat
- `getChatById(chatId)` - Get chat
- `getUserChats(userId)` - Get user's chats
- `addParticipant(chatId, userId)` - Add participant
- `removeParticipant(chatId, userId)` - Remove participant
- `isParticipant(chatId, userId)` - Check if user is participant
- `getChatParticipants(chatId)` - Get all participants
- `updateChat(chatId, name)` - Update chat
- `deleteChat(chatId)` - Delete chat

### `helpers/messageHelper.js`
- `createMessage(chatId, senderId, content, messageType)` - Create message
- `getMessageById(messageId)` - Get message
- `getChatMessages(chatId, limit, offset)` - Get messages for chat
- `updateMessage(messageId, content)` - Update message
- `deleteMessage(messageId)` - Delete message (soft delete)
- `markMessageAsRead(messageId, userId)` - Mark as read
- `getUnreadCount(chatId, userId)` - Get unread count

## 🎮 Controller Files (Business Logic)

### `controllers/authController.js`
- `register(req, res)` - Register user
- `login(req, res)` - Login user
- `getMe(req, res)` - Get current user

### `controllers/chatController.js`
- `createChat(req, res)` - Create chat
- `getUserChats(req, res)` - Get user's chats
- `getChat(req, res)` - Get chat by ID
- `updateChat(req, res)` - Update chat
- `deleteChat(req, res)` - Delete chat
- `addParticipant(req, res)` - Add participant
- `removeParticipant(req, res)` - Remove participant

### `controllers/messageController.js`
- `sendMessage(req, res)` - Send message
- `getMessages(req, res)` - Get messages
- `updateMessage(req, res)` - Update message
- `deleteMessage(req, res)` - Delete message
- `markAsRead(req, res)` - Mark message as read

## 🔐 Authentication

All routes except `/api/auth/register` and `/api/auth/login` require authentication.

**How to use:**
```javascript
// Include token in header
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

## 📝 Example Usage

### 1. Register & Login
```javascript
// Register
POST /api/auth/register
Body: { username, email, password }
Response: { token, user }

// Login
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

### 2. Create Chat
```javascript
POST /api/chats
Headers: { Authorization: 'Bearer TOKEN' }
Body: { name: 'My Chat', type: 'group', participantIds: ['user1', 'user2'] }
```

### 3. Send Message
```javascript
POST /api/chats/:chatId/messages
Headers: { Authorization: 'Bearer TOKEN' }
Body: { content: 'Hello!', messageType: 'text' }
```

### 4. Get Messages
```javascript
GET /api/chats/:chatId/messages?limit=50&offset=0
Headers: { Authorization: 'Bearer TOKEN' }
```

### 5. Update Message
```javascript
PUT /api/messages/:messageId
Headers: { Authorization: 'Bearer TOKEN' }
Body: { content: 'Updated message' }
```

### 6. Delete Message
```javascript
DELETE /api/messages/:messageId
Headers: { Authorization: 'Bearer TOKEN' }
```

## ✅ Features

- ✅ Simple structure - Easy to understand
- ✅ Separated concerns - Helpers, Controllers, Routes
- ✅ Complete CRUD - Create, Read, Update, Delete
- ✅ Authentication - JWT protected routes
- ✅ Validation - Input validation
- ✅ Error handling - Proper error responses
- ✅ Soft delete - Messages are soft deleted

## 🚀 Next Steps

1. Restart server to load new routes
2. Test endpoints with Postman or your frontend
3. Use WebSocket for real-time messaging (already set up!)

