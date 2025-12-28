# Chat App Backend Architecture

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection configuration
├── models/
│   ├── User.js              # User model
│   ├── Chat.js              # Chat/Room model
│   ├── Message.js           # Message model
│   └── index.js             # Model exports
├── routes/
│   ├── auth.js              # Authentication routes (register, login)
│   ├── users.js             # User management routes
│   ├── chats.js             # Chat/Room routes
│   ├── messages.js          # Message routes
│   └── index.js             # Route aggregator
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User operations
│   ├── chatController.js    # Chat operations
│   └── messageController.js # Message operations
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Error handling middleware
├── socket/
│   ├── socketHandler.js     # Socket.io connection and event handlers
│   └── README.md            # WebSocket documentation
├── utils/
│   ├── jwt.js               # JWT token utilities
│   └── validators.js        # Input validation
├── migrations/
│   └── init.sql             # Database schema initialization
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── server.js                # Main server entry point
```

## 🗄️ Database Schema (PostgreSQL)

### 1. **users** table
- `id` (UUID, Primary Key)
- `username` (VARCHAR, Unique, Not Null)
- `email` (VARCHAR, Unique, Not Null)
- `password` (VARCHAR, Hashed)
- `avatar_url` (VARCHAR, Optional)
- `status` (VARCHAR: 'online', 'offline', 'away')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. **chats** table
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Optional - for group chats)
- `type` (VARCHAR: 'direct', 'group')
- `created_by` (UUID, Foreign Key → users.id)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 3. **chat_participants** table (Many-to-Many)
- `id` (UUID, Primary Key)
- `chat_id` (UUID, Foreign Key → chats.id)
- `user_id` (UUID, Foreign Key → users.id)
- `joined_at` (TIMESTAMP)
- `last_read_at` (TIMESTAMP, Optional)
- Unique constraint on (chat_id, user_id)

### 4. **messages** table
- `id` (UUID, Primary Key)
- `chat_id` (UUID, Foreign Key → chats.id)
- `sender_id` (UUID, Foreign Key → users.id)
- `content` (TEXT, Not Null)
- `message_type` (VARCHAR: 'text', 'image', 'file')
- `is_edited` (BOOLEAN, Default: false)
- `is_deleted` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 5. **message_reads** table (Optional - for read receipts)
- `id` (UUID, Primary Key)
- `message_id` (UUID, Foreign Key → messages.id)
- `user_id` (UUID, Foreign Key → users.id)
- `read_at` (TIMESTAMP)
- Unique constraint on (message_id, user_id)

## 🔌 API Endpoints Structure

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)
- `PUT /api/users/:id` - Update user (protected)
- `GET /api/users/search?q=username` - Search users (protected)

### Chats
- `GET /api/chats` - Get user's chats (protected)
- `POST /api/chats` - Create new chat (protected)
- `GET /api/chats/:id` - Get chat details (protected)
- `PUT /api/chats/:id` - Update chat (protected)
- `DELETE /api/chats/:id` - Delete chat (protected)
- `POST /api/chats/:id/participants` - Add participant (protected)
- `DELETE /api/chats/:id/participants/:userId` - Remove participant (protected)

### Messages
- `GET /api/chats/:chatId/messages` - Get messages for a chat (protected)
- `POST /api/chats/:chatId/messages` - Send message (protected)
- `PUT /api/messages/:id` - Edit message (protected)
- `DELETE /api/messages/:id` - Delete message (protected)

## 🔌 WebSocket Events (Socket.io)

### Client → Server
- `chat:join` - Join a chat room
- `chat:leave` - Leave a chat room
- `message:send` - Send a new message (real-time)
- `message:read` - Mark message as read
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

### Server → Client
- `chat:joined` - Successfully joined a chat
- `chat:left` - Successfully left a chat
- `message:new` - New message received (real-time)
- `message:read` - Message read receipt
- `typing:start` - Someone started typing
- `typing:stop` - Someone stopped typing
- `user:status` - User online/offline status changed
- `error` - Error occurred

See `backend/socket/README.md` for detailed WebSocket documentation.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM/Query Builder**: pg (node-postgres) or Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator or joi
- **Real-time**: Socket.io (WebSocket support enabled)

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting (future)
- SQL injection prevention (parameterized queries)

## 📝 Next Steps

1. Initialize Node.js project with package.json
2. Install dependencies
3. Set up database connection
4. Create database schema/migrations
5. Implement authentication routes
6. Implement CRUD operations for chats and messages
7. ✅ WebSocket support for real-time messaging (COMPLETED)

