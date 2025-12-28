# 📱 Access Chat App from Your Phone

## ✅ Yes, you can use it on your phone!

Your computer's IP address: **192.168.1.11**

## 🚀 Setup Steps

### 1. Make sure both devices are on the same WiFi
- Your computer and phone must be on the **same WiFi network**

### 2. Find your computer's IP (if different)
```powershell
ipconfig | findstr /i "IPv4"
```
Look for the IP that starts with `192.168.x.x` or `10.x.x.x`

### 3. Start the backend server
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:5000` (or `http://192.168.1.11:5000` from network)

### 4. Start the frontend server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

### 5. Access from your phone
Open your phone's browser and go to:
```
http://192.168.1.11:3000
```

**Important:** Use your computer's IP address (`192.168.1.11`), NOT `localhost`!

## 🔧 How It Works

The frontend automatically detects:
- **On computer**: Uses `localhost:5000` for API
- **On phone/network**: Uses `192.168.1.11:5000` for API

The browser's hostname is used to determine which URL to use.

## 📝 Quick Reference

| Device | Frontend URL | Backend URL |
|--------|-------------|-------------|
| Computer | `http://localhost:3000` | `http://localhost:5000` |
| Phone | `http://192.168.1.11:3000` | `http://192.168.1.11:5000` |

## ⚠️ Important Notes

1. **Firewall**: Make sure Windows Firewall allows connections on ports 3000 and 5000
2. **Same Network**: Both devices must be on the same WiFi
3. **IP Changes**: If your IP changes, update the URL on your phone
4. **Development**: This works for local development. For production, use a proper domain.

## 🔥 Firewall Setup (if needed)

If you can't connect from phone:

1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Allow Node.js or add ports 3000 and 5000

Or run in PowerShell (as Administrator):
```powershell
New-NetFirewallRule -DisplayName "Node.js Dev Server" -Direction Inbound -LocalPort 3000,5000 -Protocol TCP -Action Allow
```

## ✅ Test It

1. Open `http://192.168.1.11:3000` on your phone
2. You should see the login page
3. Register/login and start chatting!

## 🎯 Alternative: Manual IP Configuration

If auto-detection doesn't work, you can manually set the IP in `frontend/src/config.js`:

```javascript
export const API_URL = 'http://192.168.1.11:5000/api'
export const SOCKET_URL = 'http://192.168.1.11:5000'
```

