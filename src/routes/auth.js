import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { AuthService } from '../services/authService.js';

const router = express.Router();

// Register endpoint
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-z0-9_]+$/)
    .withMessage('Username can only contain lowercase letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, username, email, password } = req.body;

    // Register user
    const { user, token, error } = await AuthService.register({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Login user
    const { user, token, error } = await AuthService.login(email.trim(), password);

    if (error) {
      return res.status(401).json({ error });
    }

    res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    console.error('Login endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { user, error } = await AuthService.getCurrentUser(req.user.userId);
    
    if (error) {
      return res.status(404).json({ error });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Password reset request
router.post('/reset-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email } = req.body;
    
    const { message, error } = await AuthService.resetPassword(email);
    
    if (error) {
      return res.status(500).json({ error });
    }

    res.json({ message });
  } catch (error) {
    console.error('Password reset endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password (authenticated)
router.post('/change-password', authenticateToken, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6, max: 128 })
    .withMessage('New password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*\d)/)
    .withMessage('New password must contain at least one letter and one number')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    
    const { message, error } = await AuthService.changePassword(
      req.user.userId,
      currentPassword,
      newPassword
    );

    if (error) {
      return res.status(400).json({ error });
    }

    res.json({ message });
  } catch (error) {
    console.error('Change password endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate token endpoint (for frontend to check token validity)
router.get('/validate', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      userId: req.user.userId,
      username: req.user.username,
      email: req.user.email
    }
  });
});

export default router;