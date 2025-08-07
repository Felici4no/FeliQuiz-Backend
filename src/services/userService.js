import { supabase } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class UserService {
  // Create new user
  static async createUser(userData) {
    try {
      const { name, username, email, password } = userData;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user in database
      const { data, error } = await supabase
        .from('users')
        .insert({
          username: username.toLowerCase(),
          name: name.trim(),
          email: email.toLowerCase(),
          password_hash: hashedPassword,
          profile_picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          feli_coins: 10, // Start with limited coins
          quizzes_taken: 0,
          quizzes_created: 0,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { user: data, error: null };
    } catch (error) {
      console.error('Create user error:', error);
      return { user: null, error: error.message };
    }
  }

  // Find user by email or username
  static async findUser(emailOrUsername) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${emailOrUsername.toLowerCase()},username.eq.${emailOrUsername.toLowerCase()}`)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { user: data, error: null };
    } catch (error) {
      console.error('Find user error:', error);
      return { user: null, error: error.message };
    }
  }

  // Find user by ID
  static async findUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error) {
        throw error;
      }

      return { user: data, error: null };
    } catch (error) {
      console.error('Find user by ID error:', error);
      return { user: null, error: error.message };
    }
  }

  // Find user by username (public profile)
  static async findUserByUsername(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, name, profile_picture, feli_coins, quizzes_taken, quizzes_created, created_at, updated_at, last_login')
        .eq('username', username.toLowerCase())
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { user: data, error: null };
    } catch (error) {
      console.error('Find user by username error:', error);
      return { user: null, error: error.message };
    }
  }

  // Update user profile
  static async updateUser(userId, updates) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { user: data, error: null };
    } catch (error) {
      console.error('Update user error:', error);
      return { user: null, error: error.message };
    }
  }

  // Update user coins
  static async updateUserCoins(userId, amount, operation = 'set') {
    try {
      // First get current user
      const { user: currentUser, error: getUserError } = await this.findUserById(userId);
      if (getUserError || !currentUser) {
        throw new Error('User not found');
      }

      let newAmount;
      switch (operation) {
        case 'add':
          newAmount = currentUser.feli_coins + amount;
          break;
        case 'subtract':
          newAmount = Math.max(0, currentUser.feli_coins - amount);
          break;
        case 'set':
        default:
          newAmount = Math.max(0, amount);
          break;
      }

      const { data, error } = await supabase
        .from('users')
        .update({ 
          feli_coins: newAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { 
        user: data, 
        previousAmount: currentUser.feli_coins,
        newAmount,
        error: null 
      };
    } catch (error) {
      console.error('Update user coins error:', error);
      return { user: null, error: error.message };
    }
  }

  // Update last login
  static async updateLastLogin(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Update last login error:', error);
      return { error: error.message };
    }
  }

  // Get user badges
  static async getUserBadges(userId) {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { badges: data || [], error: null };
    } catch (error) {
      console.error('Get user badges error:', error);
      return { badges: [], error: error.message };
    }
  }

  // Add badge to user
  static async addBadgeToUser(userId, badgeData) {
    try {
      const { quizId, resultId, title, image, coinValue } = badgeData;

      // Check if badge already exists
      const { data: existingBadge, error: checkError } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', userId)
        .eq('quiz_id', quizId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingBadge) {
        // Update existing badge
        const { data, error } = await supabase
          .from('user_badges')
          .update({
            result_id: resultId,
            title,
            image,
            coin_value: coinValue,
            earned_at: new Date().toISOString()
          })
          .eq('id', existingBadge.id)
          .select()
          .single();

        if (error) throw error;
        return { badge: data, isNew: false, error: null };
      } else {
        // Create new badge
        const { data, error } = await supabase
          .from('user_badges')
          .insert({
            user_id: userId,
            quiz_id: quizId,
            result_id: resultId,
            title,
            image,
            coin_value: coinValue
          })
          .select()
          .single();

        if (error) throw error;
        return { badge: data, isNew: true, error: null };
      }
    } catch (error) {
      console.error('Add badge to user error:', error);
      return { badge: null, error: error.message };
    }
  }

  // Get user quiz submissions
  static async getUserSubmissions(userId) {
    try {
      const { data, error } = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { submissions: data || [], error: null };
    } catch (error) {
      console.error('Get user submissions error:', error);
      return { submissions: [], error: error.message };
    }
  }

  // Check if user exists by email or username
  static async checkUserExists(email, username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, username')
        .or(`email.eq.${email.toLowerCase()},username.eq.${username.toLowerCase()}`)
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      const emailExists = data?.some(user => user.email === email.toLowerCase());
      const usernameExists = data?.some(user => user.username === username.toLowerCase());

      return { 
        emailExists, 
        usernameExists, 
        error: null 
      };
    } catch (error) {
      console.error('Check user exists error:', error);
      return { emailExists: false, usernameExists: false, error: error.message };
    }
  }
}