# Environment Variables Setup

## 📝 Configuration

The frontend uses environment variables to configure API and WebSocket URLs.

## 🔧 Setup

### 1. Create `.env` file

The `.env` file is already created in the `frontend` folder with default values.

### 2. For Local Development (Same Device)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. For Mobile Access (Network)

Update `.env` with your computer's IP address:

```env
VITE_API_URL=http://192.168.1.11:5000/api
VITE_SOCKET_URL=http://192.168.1.11:5000
```

**Your computer's IP:** `192.168.1.11`

## 🔄 How to Change

1. **Open** `frontend/.env` file
2. **Update** the URLs with your IP address:
   ```
   VITE_API_URL=http://192.168.1.11:5000/api
   VITE_SOCKET_URL=http://192.168.1.11:5000
   ```
3. **Restart** the frontend server:
   ```bash
   npm run dev
   ```

## 📱 Mobile Access

1. Make sure both devices are on the same WiFi
2. Update `.env` with your computer's IP (192.168.1.11)
3. Restart frontend server
4. On phone, open: `http://192.168.1.11:3000`

## 🔍 Find Your IP

Run this command to find your IP:
```powershell
ipconfig | findstr /i "IPv4"
```

Look for the IP that starts with `192.168.x.x` or `10.x.x.x`

## ✅ Default Behavior

If `.env` is not set, the app will:
- Auto-detect localhost vs network
- Use browser's hostname for network access
- Fallback to localhost if detection fails

## 📋 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | WebSocket URL | `http://localhost:5000` |

**Note:** Vite requires `VITE_` prefix for environment variables to be exposed to the client.

