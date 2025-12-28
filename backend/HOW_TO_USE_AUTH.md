# How to Use Authentication - Step by Step

## ⚠️ IMPORTANT: Restart Your Server First!

The server needs to be restarted to load the new authentication routes.

### Stop the current server:
- Press `Ctrl+C` in the terminal where the server is running
- Or kill the process: `Get-Process -Name node | Stop-Process -Force`

### Start the server again:
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

## 🎯 Method 1: Using the HTML Test Page (Easiest!)

1. **Open the test page:**
   - Open `backend/test-auth-simple.html` in your browser
   - Or serve it: Right-click → Open with → Your browser

2. **Register a user:**
   - Fill in username, email, password
   - Click "Register"
   - Your JWT token will appear automatically!

3. **Test WebSocket:**
   - Click "Connect to WebSocket"
   - You should see "✅ Connected!"

---

## 🎯 Method 2: Using PowerShell (Windows)

### Step 1: Register a User

```powershell
# Register
$body = @{
    username = "alice"
    email = "alice@test.com"
    password = "Alice123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

# Display results
Write-Host "✅ Registered!" -ForegroundColor Green
Write-Host "Username: $($response.user.username)" -ForegroundColor Cyan
Write-Host "Token: $($response.token)" -ForegroundColor Yellow

# Save token
$token = $response.token
```

### Step 2: Test Protected Route

```powershell
# Test protected route
$meResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" }

Write-Host "Current user: $($meResponse.user.username)" -ForegroundColor Green
```

### Step 3: Login (Alternative)

```powershell
# Login
$loginBody = @{
    email = "alice@test.com"
    password = "Alice123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$token = $loginResponse.token
Write-Host "New token: $token" -ForegroundColor Yellow
```

---

## 🎯 Method 3: Using cURL (Command Line)

### Step 1: Register

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"alice\",\"email\":\"alice@test.com\",\"password\":\"Alice123\"}"
```

**Copy the `token` from the response!**

### Step 2: Use Token

```bash
# Replace YOUR_TOKEN with the token you got
curl -X GET http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Method 4: Using JavaScript/React

### Register and Get Token:

```javascript
// Register
const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'alice',
    email: 'alice@test.com',
    password: 'Alice123'
  })
});

const { token, user } = await registerResponse.json();
console.log('Token:', token);

// Store token
localStorage.setItem('token', token);
```

### Use Token for Protected Routes:

```javascript
// Get token from storage
const token = localStorage.getItem('token');

// Use in API calls
const response = await fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { user } = await response.json();
console.log('Current user:', user);
```

### Use Token for WebSocket:

```javascript
import io from 'socket.io-client';

const token = localStorage.getItem('token');

const socket = io('http://localhost:5000', {
  auth: { token: token }
});

socket.on('connect', () => {
  console.log('✅ Connected!', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
});
```

---

## 📋 Complete Example: Full Flow

```javascript
// 1. Register user
async function registerUser() {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'alice',
      email: 'alice@test.com',
      password: 'Alice123'
    })
  });
  
  const data = await response.json();
  return data.token; // Save this token!
}

// 2. Use token for API
async function getCurrentUser(token) {
  const response = await fetch('http://localhost:5000/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return await response.json();
}

// 3. Connect to WebSocket
function connectWebSocket(token) {
  const socket = io('http://localhost:5000', {
    auth: { token: token }
  });
  
  socket.on('connect', () => {
    console.log('Connected!');
  });
  
  return socket;
}

// Usage:
const token = await registerUser();
const user = await getCurrentUser(token);
const socket = connectWebSocket(token);
```

---

## ✅ Quick Test Checklist

1. ✅ Server is running (`npm run dev`)
2. ✅ Database is connected
3. ✅ Register a user → Get token
4. ✅ Test protected route with token
5. ✅ Connect to WebSocket with token

---

## 🐛 Troubleshooting

### "Route not found" error
- **Solution:** Restart the server! The routes were just added.

### "Authentication required" error
- **Solution:** Make sure you're sending the token in the `Authorization` header
- Format: `Authorization: Bearer YOUR_TOKEN`

### "Invalid token" error
- **Solution:** Token might be expired or invalid. Try registering/login again.

### WebSocket connection fails
- **Solution:** 
  1. Make sure token is valid
  2. Check server is running
  3. Verify CORS settings in `.env`

---

## 🎯 Next Steps

1. ✅ Get your JWT token (register/login)
2. ✅ Test protected routes
3. ✅ Connect to WebSocket
4. ✅ Start building your chat app!

