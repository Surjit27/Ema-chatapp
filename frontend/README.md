# Chat App Frontend

Simple, clean white-themed React frontend for the chat application.

## 🚀 Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## 📁 Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   ├── Chat.jsx           # Main chat component
│   │   ├── ChatList.jsx       # Chat list sidebar
│   │   ├── MessageList.jsx    # Message display
│   │   └── MessageInput.jsx   # Message input
│   ├── services/
│   │   ├── api.js             # REST API calls
│   │   └── socket.js          # WebSocket connection
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
└── package.json
```

## 🎨 Features

- ✅ White, clean theme
- ✅ Simple and intuitive UI
- ✅ User authentication (Login/Register)
- ✅ Chat list with search
- ✅ Real-time messaging via WebSocket
- ✅ Message display with timestamps
- ✅ Responsive design

## 🔌 Backend Connection

Make sure your backend is running on `http://localhost:5000`

The frontend will automatically connect to:
- REST API: `http://localhost:5000/api`
- WebSocket: `http://localhost:5000`

## 📝 Usage

1. **Register/Login**: Create an account or sign in
2. **Search Users**: Use the search bar to find users
3. **Start Chat**: Click on a user to start a chat
4. **Send Messages**: Type and send messages in real-time
5. **View Chats**: See all your chats in the sidebar

## 🎯 Next Steps

- Add user profile
- Add message editing/deleting
- Add file/image uploads
- Add typing indicators
- Add read receipts

