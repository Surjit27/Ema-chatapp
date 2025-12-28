/**
 * WebSocket Test Script
 * 
 * This is a simple test script to verify WebSocket functionality.
 * Run this after starting the server to test WebSocket events.
 * 
 * Usage: node examples/websocket-test.js
 */

const io = require('socket.io-client');

// Replace with your actual JWT token (you'll get this after implementing auth)
const TEST_TOKEN = 'your-jwt-token-here';
const SERVER_URL = 'http://localhost:5000';

console.log('🔌 Connecting to WebSocket server...\n');

// Connect to server
const socket = io(SERVER_URL, {
  auth: {
    token: TEST_TOKEN
  },
  transports: ['websocket']
});

// Connection events
socket.on('connect', () => {
  console.log('✅ Connected to server');
  console.log('   Socket ID:', socket.id);
  console.log('\n📝 Available commands:');
  console.log('   - socket.emit("chat:join", { chatId: "your-chat-id" })');
  console.log('   - socket.emit("message:send", { chatId: "...", content: "Hello!" })');
  console.log('   - socket.emit("typing:start", { chatId: "..." })');
  console.log('\n');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
  console.log('\n💡 Make sure:');
  console.log('   1. Server is running (npm run dev)');
  console.log('   2. You have a valid JWT token');
  console.log('   3. Database is set up and running');
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

// User status events
socket.on('user:status', (data) => {
  console.log(`👤 User ${data.userId} is now ${data.status}`);
});

// Chat events
socket.on('chat:joined', (data) => {
  console.log(`✅ Joined chat: ${data.chatId}`);
});

socket.on('chat:left', (data) => {
  console.log(`👋 Left chat: ${data.chatId}`);
});

// Message events
socket.on('message:new', (message) => {
  console.log('\n📨 New message received:');
  console.log('   Chat:', message.chat_id);
  console.log('   From:', message.sender?.username || message.sender_id);
  console.log('   Content:', message.content);
  console.log('   Time:', new Date(message.created_at).toLocaleTimeString());
  console.log('');
});

socket.on('message:read', (data) => {
  console.log(`✓ Message ${data.messageId} read by user ${data.userId}`);
});

// Typing events
socket.on('typing:start', (data) => {
  console.log(`⌨️  ${data.username} is typing in chat ${data.chatId}...`);
});

socket.on('typing:stop', (data) => {
  console.log(`   User ${data.userId} stopped typing`);
});

// Error events
socket.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

// Keep process alive
process.stdin.resume();

console.log('💡 This script will keep running. Use Ctrl+C to exit.');
console.log('💡 Open another terminal and interact with the socket object in Node REPL if needed.\n');

