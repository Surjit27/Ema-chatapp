# Environment Variables Setup

## 📝 Quick Setup

### Step 1: Create `.env` file

Create a file named `.env` in the `frontend` folder with this content:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 2: For Mobile Access

Update the `.env` file with your computer's IP:

```env
# For mobile/network access
VITE_API_URL=http://192.168.1.11:5000/api
VITE_SOCKET_URL=http://192.168.1.11:5000
```

**Your IP:** `192.168.1.11` (from ipconfig)

### Step 3: Restart Frontend

After changing `.env`, restart the frontend:
```bash
cd frontend
npm run dev
```

## 🔄 Switching Between Local and Mobile

**For local development:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**For mobile access:**
```env
VITE_API_URL=http://192.168.1.11:5000/api
VITE_SOCKET_URL=http://192.168.1.11:5000
```

## 📱 How to Use on Phone

1. Update `.env` with your IP (192.168.1.11)
2. Restart frontend: `npm run dev`
3. On phone browser: `http://192.168.1.11:3000`

## ✅ Done!

The app will now use the URLs from `.env` file!

