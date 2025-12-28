# JWT (JSON Web Token) Guide

## 🔐 What is JWT?

**JWT (JSON Web Token)** is a secure way to transmit information between parties as a JSON object. In our chat app, JWTs are used for **authentication** - proving that a user is who they claim to be.

### How JWT Works:

```
1. User logs in → Server verifies credentials
2. Server creates JWT token → Contains user ID
3. Client stores token → Usually in localStorage
4. Client sends token → With every request
5. Server verifies token → Grants access if valid
```

## 📦 JWT Structure

A JWT has 3 parts separated by dots (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3OCIsImlhdCI6MTYwOTg3NjU0Mn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

1. **Header** - Algorithm and token type
2. **Payload** - User data (userId in our case)
3. **Signature** - Ensures token hasn't been tampered with

## 🎯 How to Get a JWT Token

### Step 1: Register a New User

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "status": "offline"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 2: Login (Get Token)

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "status": "online"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔑 Using JWT Token

### 1. **For REST API Requests**

Include the token in the `Authorization` header:

```javascript
fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### 2. **For WebSocket Connection**

Include the token in the connection:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token-here'
  }
});
```

## 📝 Example: Complete Flow

### Using cURL:

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123"
  }'

# Response will include a token - save it!

# 2. Use token for protected route
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript/Fetch:

```javascript
// 1. Register
const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test123'
  })
});

const { token, user } = await registerResponse.json();

// 2. Store token
localStorage.setItem('token', token);

// 3. Use token for protected routes
const meResponse = await fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { user: currentUser } = await meResponse.json();
```

## 🔒 Security Features

1. **Token Expiration**: Tokens expire after 7 days (configurable)
2. **Password Hashing**: Passwords are hashed with bcrypt (never stored in plain text)
3. **Token Verification**: Server verifies token signature on every request
4. **User Validation**: Server checks if user still exists in database

## ⚠️ Important Notes

1. **Never share your token** - It's like a password
2. **Store securely** - Use localStorage or httpOnly cookies
3. **Token expires** - You'll need to login again after expiration
4. **Change JWT_SECRET** - Use a strong secret in production

## 🧪 Testing Authentication

### Test Registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@test.com","password":"Alice123"}'
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"Alice123"}'
```

### Test Protected Route:
```bash
# Replace YOUR_TOKEN with the token from login/register
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Available Endpoints

- `POST /api/auth/register` - Register new user (get token)
- `POST /api/auth/login` - Login user (get token)
- `GET /api/auth/me` - Get current user (requires token)

## 🎯 Next Steps

1. Register a user to get your first JWT token
2. Use the token to connect to WebSocket
3. Use the token for protected API routes

