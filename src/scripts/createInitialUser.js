import { AuthService } from '../services/authService.js';
import { supabase } from '../config/database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createInitialUser() {
  console.log('👤 Creating initial user: lucas_feliciano...\n');

  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('username', 'lucas_feliciano')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingUser) {
      console.log('ℹ️  User lucas_feliciano already exists');
      console.log('   ID:', existingUser.id);
      console.log('   Email:', existingUser.email);
      console.log('   Username:', existingUser.username);
      return;
    }

    // Create the initial user
    const { user, token, error } = await AuthService.register({
      name: 'Lucas Feliciano',
      username: 'lucas_feliciano',
      email: 'lucas@feliquiz.com',
      password: '07052003'
    });

    if (error) {
      console.error('❌ Failed to create initial user:', error);
      return;
    }

    console.log('✅ Initial user created successfully!');
    console.log('   ID:', user.id);
    console.log('   Name:', user.name);
    console.log('   Username:', user.username);
    console.log('   Email:', user.email);
    console.log('   FeliCoins:', user.feli_coins);
    console.log('   Token generated:', !!token);

    // Update user to have creator privileges (more FeliCoins)
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        feli_coins: 500, // Creator bonus
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.warn('⚠️  Failed to update creator privileges:', updateError);
    } else {
      console.log('✅ Creator privileges granted (500 FeliCoins)');
    }

    console.log('\n🎉 Setup completed! You can now login with:');
    console.log('   Username: lucas_feliciano');
    console.log('   Password: 07052003');

  } catch (error) {
    console.error('❌ Error creating initial user:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createInitialUser().then(() => process.exit(0));
}

export default createInitialUser;