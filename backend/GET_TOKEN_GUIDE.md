# 🎯 How to Get JWT Token - Quick Guide

## ✅ Method 1: Use the PowerShell Script (Easiest!)

I've created a script for you. Just run:

```powershell
cd backend
.\get-token.ps1
```

This will:
- ✅ Register a new user
- ✅ Get the JWT token
- ✅ Save it to `token.txt`
- ✅ Display it on screen

---

## ✅ Method 2: One-Line PowerShell Command

```powershell
$body = @{username="testuser"; email="test@test.com"; password="Test123"} | ConvertTo-Json; Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body $body | Select-Object -ExpandProperty token
```

This will output just the token.

---

## ✅ Method 3: Using cURL (Command Line)

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@test.com\",\"password\":\"Test123\"}"
```

Copy the `token` value from the JSON response.

---

## ✅ Method 4: Using the HTML Test Page

1. Open `backend/test-auth-simple.html` in your browser
2. Fill in the registration form
3. Click "Register"
4. Your token will appear automatically!

---

## ✅ Method 5: Login Instead of Register

If you already have a user, login to get a token:

```powershell
$body = @{email="test@test.com"; password="Test123"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
$response.token
```

---

## 📋 Your Current Token

Your token is saved in `backend/token.txt`

**Your token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZWE4ZjgwYS03MDM3LTRjYTUtYTQyNC0zNTNiOTZmMWNiYzkiLCJpYXQiOjE3NjY5MDY5MDksImV4cCI6MTc2NzUxMTcwOX0.eJ29EgU2WngETqrOxW_R9id8yK7VxRm7JXM3c0p1n7s
```

---

## 🔑 How to Use Your Token

### 1. For REST API Calls:

```powershell
$token = Get-Content "backend/token.txt"
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
    -Headers @{ "Authorization" = "Bearer $token" }
```

### 2. For WebSocket Connection:

```javascript
import io from 'socket.io-client';

const token = 'YOUR_TOKEN_HERE'; // or read from token.txt

const socket = io('http://localhost:5000', {
  auth: { token: token }
});

socket.on('connect', () => {
  console.log('✅ Connected!');
});
```

### 3. In JavaScript/Fetch:

```javascript
const token = 'YOUR_TOKEN_HERE';

fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🧪 Quick Test

Test your token right now:

```powershell
# Read token from file
$token = Get-Content "backend/token.txt"

# Test protected route
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
    -Headers @{ "Authorization" = "Bearer $token" }
```

You should see your user information!

---

## 📝 Token Information

- **Expires in:** 7 days (configurable in `.env`)
- **Contains:** Your user ID
- **Use for:** 
  - WebSocket connections
  - Protected API routes
  - Authentication

---

## 🔄 Get a New Token

If your token expires or you need a new one:

1. **Login again:**
   ```powershell
   $body = @{email="test@test.com"; password="Test123"} | ConvertTo-Json
   Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
   ```

2. **Or register a new user:**
   ```powershell
   .\get-token.ps1
   ```

---

## ✅ Summary

**Easiest way to get token:**
```powershell
cd backend
.\get-token.ps1
```

**Token location:** `backend/token.txt`

**Use it for:**
- WebSocket: `auth: { token: 'YOUR_TOKEN' }`
- API: `Authorization: Bearer YOUR_TOKEN`

