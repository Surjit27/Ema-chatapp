/**
 * Authentication Test Script
 * 
 * This script demonstrates how to:
 * 1. Register a new user (get JWT token)
 * 2. Login (get JWT token)
 * 3. Use token for protected routes
 * 
 * Usage: node examples/test-auth.js
 */

const BASE_URL = 'http://localhost:5000';

// Test user credentials
const testUser = {
  username: 'testuser_' + Date.now(),
  email: `test${Date.now()}@example.com`,
  password: 'Test123'
};

async function testAuth() {
  console.log('🧪 Testing Authentication System\n');
  console.log('='.repeat(50));

  try {
    // 1. Test Registration
    console.log('\n1️⃣  Testing Registration...');
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      console.error('❌ Registration failed:', registerData);
      return;
    }

    console.log('✅ Registration successful!');
    console.log('   User:', registerData.user.username);
    console.log('   Email:', registerData.user.email);
    console.log('   Token:', registerData.token.substring(0, 50) + '...');
    
    const token = registerData.token;

    // 2. Test Protected Route (Get Current User)
    console.log('\n2️⃣  Testing Protected Route (GET /api/auth/me)...');
    const meResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const meData = await meResponse.json();

    if (!meResponse.ok) {
      console.error('❌ Get me failed:', meData);
      return;
    }

    console.log('✅ Protected route accessed successfully!');
    console.log('   Current user:', meData.user.username);

    // 3. Test Login
    console.log('\n3️⃣  Testing Login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginData);
      return;
    }

    console.log('✅ Login successful!');
    console.log('   User:', loginData.user.username);
    console.log('   Status:', loginData.user.status);
    console.log('   New token:', loginData.token.substring(0, 50) + '...');

    // 4. Test Invalid Token
    console.log('\n4️⃣  Testing Invalid Token...');
    const invalidResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': 'Bearer invalid_token_here'
      }
    });

    const invalidData = await invalidResponse.json();
    
    if (invalidResponse.status === 401) {
      console.log('✅ Invalid token correctly rejected!');
      console.log('   Error:', invalidData.message);
    } else {
      console.log('⚠️  Unexpected response:', invalidData);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All tests completed!\n');
    console.log('💡 Your JWT token:');
    console.log('   ' + token);
    console.log('\n💡 Use this token for WebSocket connection:');
    console.log(`   const socket = io('${BASE_URL}', {`);
    console.log(`     auth: { token: '${token.substring(0, 30)}...' }`);
    console.log('   });\n');

  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.log('\n💡 Make sure the server is running:');
    console.log('   npm run dev');
  }
}

// Run tests if fetch is available (Node.js 18+)
if (typeof fetch !== 'undefined') {
  testAuth();
} else {
  console.log('❌ This script requires Node.js 18+ (for native fetch)');
  console.log('💡 Alternatively, use curl or Postman to test the endpoints');
  console.log('\nExample curl commands:');
  console.log('\n1. Register:');
  console.log(`curl -X POST ${BASE_URL}/api/auth/register \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log(`  -d '{"username":"test","email":"test@test.com","password":"Test123"}'`);
  console.log('\n2. Login:');
  console.log(`curl -X POST ${BASE_URL}/api/auth/login \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log(`  -d '{"email":"test@test.com","password":"Test123"}'`);
  console.log('\n3. Get current user (replace YOUR_TOKEN):');
  console.log(`curl -X GET ${BASE_URL}/api/auth/me \\`);
  console.log('  -H "Authorization: Bearer YOUR_TOKEN"');
}

