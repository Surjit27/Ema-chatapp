# Quick Start: Authentication Guide

## 🚀 Step-by-Step Guide

### Step 1: Make sure server is running

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
🔌 WebSocket server ready
✅ Database connected
```

---

## 📝 Step 2: Register a New User (Get JWT Token)

### Option A: Using cURL (Command Line)

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"alice\",\"email\":\"alice@test.com\",\"password\":\"Alice123\"}"
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "username": "alice",
    "email": "alice@test.com",
    "status": "offline"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI..."
}
```

**💡 Copy the `token` value - you'll need it!**

### Option B: Using PowerShell (Windows)

```powershell
$body = @{
    username = "alice"
    email = "alice@test.com"
    password = "Alice123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Option C: Using Browser (Postman/Thunder Client)

1. Open Postman or VS Code Thunder Client
2. Create new POST request to: `http://localhost:5000/api/auth/register`
3. Set Headers: `Content-Type: application/json`
4. Body (JSON):
```json
{
  "username": "alice",
  "email": "alice@test.com",
  "password": "Alice123"
}
```
5. Send request
6. Copy the `token` from response

---

## 🔑 Step 3: Login (Alternative way to get token)

### Using cURL:
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"alice@test.com\",\"password\":\"Alice123\"}"
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## ✅ Step 4: Use Token for Protected Routes

### Test Protected Route (Get Current User)

Replace `YOUR_TOKEN` with the token you got:

```bash
curl -X GET http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

**PowerShell:**
```powershell
$token = "YOUR_TOKEN_HERE"
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" }
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "username": "alice",
    "email": "alice@test.com",
    "status": "online"
  }
}
```

---

## 🔌 Step 5: Use Token for WebSocket Connection

### JavaScript/React Example:

```javascript
import io from 'socket.io-client';

// Get token from localStorage (after login)
const token = localStorage.getItem('token');

// Connect to WebSocket with token
const socket = io('http://localhost:5000', {
  auth: {
    token: token
  }
});

// Listen for connection
socket.on('connect', () => {
  console.log('✅ Connected to WebSocket!');
  console.log('Socket ID:', socket.id);
});

// Listen for errors
socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
});

// Now you can use WebSocket events:
// - socket.emit('message:send', {...})
// - socket.on('message:new', (message) => {...})
```

### HTML/JavaScript Example:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Chat App - WebSocket Test</title>
    <script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
</head>
<body>
    <h1>WebSocket Test</h1>
    <input type="text" id="tokenInput" placeholder="Paste your JWT token">
    <button onclick="connect()">Connect</button>
    <div id="status"></div>
    <div id="messages"></div>

    <script>
        let socket;
        
        function connect() {
            const token = document.getElementById('tokenInput').value;
            
            socket = io('http://localhost:5000', {
                auth: { token: token }
            });
            
            socket.on('connect', () => {
                document.getElementById('status').innerHTML = 
                    '✅ Connected! Socket ID: ' + socket.id;
            });
            
            socket.on('connect_error', (error) => {
                document.getElementById('status').innerHTML = 
                    '❌ Error: ' + error.message;
            });
            
            socket.on('message:new', (message) => {
                const div = document.createElement('div');
                div.textContent = message.sender.username + ': ' + message.content;
                document.getElementById('messages').appendChild(div);
            });
        }
    </script>
</body>
</html>
```

---

## 🧪 Complete Test Script

Save this as `test-auth.ps1` and run it:

```powershell
# Test Authentication
Write-Host "🧪 Testing Authentication..." -ForegroundColor Cyan

# 1. Register
Write-Host "`n1️⃣  Registering user..." -ForegroundColor Yellow
$registerBody = @{
    username = "testuser_$(Get-Date -Format 'yyyyMMddHHmmss')"
    email = "test$(Get-Date -Format 'yyyyMMddHHmmss')@test.com"
    password = "Test123"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $registerBody

Write-Host "✅ Registered: $($registerResponse.user.username)" -ForegroundColor Green
Write-Host "   Token: $($registerResponse.token.Substring(0, 50))..." -ForegroundColor Gray

$token = $registerResponse.token

# 2. Test Protected Route
Write-Host "`n2️⃣  Testing protected route..." -ForegroundColor Yellow
$meResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" }

Write-Host "✅ Current user: $($meResponse.user.username)" -ForegroundColor Green

# 3. Login
Write-Host "`n3️⃣  Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = $registerResponse.user.email
    password = "Test123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

Write-Host "✅ Logged in: $($loginResponse.user.username)" -ForegroundColor Green
Write-Host "   New token: $($loginResponse.token.Substring(0, 50))..." -ForegroundColor Gray

Write-Host "`n🎉 All tests passed!" -ForegroundColor Green
Write-Host "`n💡 Your token for WebSocket:" -ForegroundColor Cyan
Write-Host "   $token" -ForegroundColor Yellow
```

---

## 📋 Quick Reference

### Endpoints:
- `POST /api/auth/register` - Register (get token)
- `POST /api/auth/login` - Login (get token)  
- `GET /api/auth/me` - Get current user (needs token)

### Password Requirements:
- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

### Username Requirements:
- 3-50 characters
- Only letters, numbers, and underscores

---

## 🐛 Troubleshooting

### "Authentication required" error
- Make sure you're sending the token in the `Authorization` header
- Format: `Authorization: Bearer YOUR_TOKEN`

### "Invalid or expired token" error
- Token might be expired (default: 7 days)
- Token might be invalid - try logging in again

### WebSocket connection fails
- Make sure token is valid
- Check server is running
- Verify CORS settings in `.env`

---

## 🎯 Next Steps

1. ✅ Register/Login to get token
2. ✅ Test protected routes
3. ✅ Connect to WebSocket with token
4. ✅ Start building your chat app!

