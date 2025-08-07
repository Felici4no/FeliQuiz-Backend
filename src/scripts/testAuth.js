import { AuthService } from '../services/authService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testAuthSystem() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Register new user
    console.log('1️⃣ Testing user registration...');
    const registerResult = await AuthService.register({
      name: 'Test User',
      username: 'testuser123',
      email: 'test@example.com',
      password: 'password123'
    });

    if (registerResult.error) {
      console.log('❌ Registration failed:', registerResult.error);
    } else {
      console.log('✅ Registration successful');
      console.log('   User ID:', registerResult.user.id);
      console.log('   Username:', registerResult.user.username);
      console.log('   Token generated:', !!registerResult.token);
    }

    // Test 2: Login with email
    console.log('\n2️⃣ Testing login with email...');
    const loginEmailResult = await AuthService.login('test@example.com', 'password123');

    if (loginEmailResult.error) {
      console.log('❌ Email login failed:', loginEmailResult.error);
    } else {
      console.log('✅ Email login successful');
      console.log('   User:', loginEmailResult.user.name);
      console.log('   FeliCoins:', loginEmailResult.user.feli_coins);
    }

    // Test 3: Login with username
    console.log('\n3️⃣ Testing login with username...');
    const loginUsernameResult = await AuthService.login('testuser123', 'password123');

    if (loginUsernameResult.error) {
      console.log('❌ Username login failed:', loginUsernameResult.error);
    } else {
      console.log('✅ Username login successful');
      console.log('   User:', loginUsernameResult.user.name);
    }

    // Test 4: Login with lucas_feliciano credentials
    console.log('\n4️⃣ Testing login with lucas_feliciano...');
    const lucasLoginResult = await AuthService.login('lucas_feliciano', '07052003');

    if (lucasLoginResult.error) {
      console.log('❌ Lucas login failed:', lucasLoginResult.error);
    } else {
      console.log('✅ Lucas login successful');
      console.log('   User:', lucasLoginResult.user.name);
      console.log('   Username:', lucasLoginResult.user.username);
      console.log('   FeliCoins:', lucasLoginResult.user.feli_coins);
      console.log('   Can create quizzes:', lucasLoginResult.user.username === 'lucas_feliciano');
    }

    // Test 5: Invalid credentials
    console.log('\n5️⃣ Testing invalid credentials...');
    const invalidResult = await AuthService.login('nonexistent@email.com', 'wrongpassword');

    if (invalidResult.error) {
      console.log('✅ Invalid credentials properly rejected:', invalidResult.error);
    } else {
      console.log('❌ Invalid credentials should have been rejected');
    }

    // Test 6: Password reset
    console.log('\n6️⃣ Testing password reset...');
    const resetResult = await AuthService.resetPassword('test@example.com');

    if (resetResult.error) {
      console.log('❌ Password reset failed:', resetResult.error);
    } else {
      console.log('✅ Password reset request processed');
      console.log('   Message:', resetResult.message);
    }

    console.log('\n🎉 Authentication system testing completed!');

  } catch (error) {
    console.error('❌ Test suite error:', error);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAuth().then(() => process.exit(0));
}

export default testAuthSystem;