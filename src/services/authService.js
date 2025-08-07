import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database.js';

export class AuthService {
  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate username format
  static isValidUsername(username) {
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  // Hash password securely
  static async hashPassword(password) {
    try {
      const saltRounds = 12;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new Error('Error hashing password');
    }
  }

  // Verify password
  static async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error('Error verifying password');
    }
  }

  // Generate JWT token
  static generateToken(user) {
    try {
      return jwt.sign(
        { 
          userId: user.id, 
          username: user.username,
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
    } catch (error) {
      throw new Error('Error generating token');
    }
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Register new user
  static async register(userData) {
    try {
      const { name, username, email, password } = userData;

      console.log('🔐 Attempting to register user:', { name, username, email });

      // Input validation
      if (!name || name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters');
      }

      if (!this.isValidUsername(username)) {
        throw new Error('Username must be 3-20 characters (letters, numbers, underscore only)');
      }

      if (!this.isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id, email, username')
        .or(`email.eq.${email.toLowerCase()},username.eq.${username.toLowerCase()}`);

      if (checkError) {
        console.error('Database check error:', checkError);
        throw new Error('Database error during user validation');
      }

      if (existingUsers && existingUsers.length > 0) {
        const emailExists = existingUsers.some(u => u.email === email.toLowerCase());
        const usernameExists = existingUsers.some(u => u.username === username.toLowerCase());
        
        if (emailExists) {
          throw new Error('Email already exists');
        }
        if (usernameExists) {
          throw new Error('Username already exists');
        }
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);
      console.log('🔒 Password hashed successfully');

      // Create user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          username: username.toLowerCase(),
          name: name.trim(),
          email: email.toLowerCase(),
          password_hash: hashedPassword,
          profile_picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          feli_coins: 10, // Start with limited coins for scarcity
          quizzes_taken: 0,
          quizzes_created: 0,
          is_active: true
        })
        .select()
        .single();

      if (createError) {
        console.error('User creation error:', createError);
        throw new Error('Failed to create user account');
      }

      console.log('✅ User created successfully:', newUser.username);

      // Generate token
      const token = this.generateToken(newUser);
      console.log('🎫 JWT token generated');

      // Remove password hash from response
      const { password_hash, ...userResponse } = newUser;

      return {
        user: userResponse,
        token,
        error: null
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        user: null,
        token: null,
        error: error.message
      };
    }
  }

  // Login user
  static async login(emailOrUsername, password) {
    try {
      console.log('🔐 Attempting login for:', emailOrUsername);

      // Input validation
      if (!emailOrUsername || !emailOrUsername.trim()) {
        throw new Error('Email or username is required');
      }

      if (!password) {
        throw new Error('Password is required');
      }

      // Find user by email or username
      const { data: users, error: findError } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${emailOrUsername.toLowerCase()},username.eq.${emailOrUsername.toLowerCase()}`)
        .eq('is_active', true);

      if (findError) {
        console.error('User lookup error:', findError);
        throw new Error('Database error during login');
      }

      if (!users || users.length === 0) {
        console.log('❌ User not found:', emailOrUsername);
        throw new Error('Invalid credentials');
      }

      const user = users[0];
      console.log('👤 User found:', user.username);

      // Verify password
      const isValidPassword = await this.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        console.log('❌ Invalid password for user:', user.username);
        throw new Error('Invalid credentials');
      }

      console.log('✅ Password verified for user:', user.username);

      // Update last login
      await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      // Get user badges
      const { data: badges } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      console.log('🏆 Loaded', badges?.length || 0, 'badges for user');

      // Generate token
      const token = this.generateToken(user);
      console.log('🎫 JWT token generated for user:', user.username);

      // Remove password hash from response
      const { password_hash, ...userResponse } = user;
      userResponse.badges = badges || [];

      return {
        user: userResponse,
        token,
        error: null
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        user: null,
        token: null,
        error: error.message
      };
    }
  }

  // Get current user from token
  static async getCurrentUser(userId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (userError) {
        console.error('Get current user error:', userError);
        throw new Error('User not found');
      }

      // Get user badges
      const { data: badges } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      // Remove password hash from response
      const { password_hash, ...userResponse } = user;
      userResponse.badges = badges || [];

      return {
        user: userResponse,
        error: null
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        user: null,
        error: error.message
      };
    }
  }

  // Reset password
  static async resetPassword(email) {
    try {
      if (!this.isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      // Check if user exists
      const { data: user, error: findError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        console.error('Password reset lookup error:', findError);
        throw new Error('Database error');
      }

      // Always return success for security (don't reveal if email exists)
      // In production, you would send an actual email here
      if (user) {
        console.log(`Password reset requested for: ${user.email}`);
        // TODO: Implement email sending logic
      }

      return {
        message: 'If an account with that email exists, a password reset link has been sent.',
        error: null
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        message: null,
        error: error.message
      };
    }
  }

  // Change password (for authenticated users)
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // Input validation
      if (!currentPassword) {
        throw new Error('Current password is required');
      }

      if (!newPassword || newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters');
      }

      // Get current user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (userError) {
        console.error('Get user for password change error:', userError);
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await this.verifyPassword(currentPassword, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update password
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          password_hash: hashedNewPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Password update error:', updateError);
        throw new Error('Failed to update password');
      }

      return {
        message: 'Password changed successfully',
        error: null
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        message: null,
        error: error.message
      };
    }
  }
}