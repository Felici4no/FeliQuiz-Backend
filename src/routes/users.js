import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { UserService } from '../services/userService.js';

const router = express.Router();

// Get user profile by username (public)
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { user, error } = await UserService.findUserByUsername(username);
    
    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user badges
    const { badges } = await UserService.getUserBadges(user.id);
    user.badges = badges;

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile (authenticated)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, profilePicture } = req.body;

    // Validate input
    if (name && name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (profilePicture) updates.profile_picture = profilePicture;

    const { user, error } = await UserService.updateUser(req.user.userId, updates);

    if (error) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    // Get user badges
    const { badges } = await UserService.getUserBadges(user.id);
    
    // Remove password from response
    const { password_hash, ...userResponse } = user;
    userResponse.badges = badges;
    
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user quiz submissions
router.get('/:username/submissions', async (req, res) => {
  try {
    const { username } = req.params;
    const { user, error } = await UserService.findUserByUsername(username);
    
    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { submissions, error: submissionsError } = await UserService.getUserSubmissions(user.id);

    if (submissionsError) {
      return res.status(500).json({ error: 'Failed to get submissions' });
    }

    res.json({ 
      submissions,
      total: submissions.length 
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user coins (internal use)
router.patch('/:id/coins', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, operation = 'set' } = req.body;
    
    // Only allow users to update their own coins
    if (req.user.userId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { user, previousAmount, newAmount, error } = await UserService.updateUserCoins(id, amount, operation);

    if (error) {
      return res.status(500).json({ error: 'Failed to update coins' });
    }

    // Get user badges
    const { badges } = await UserService.getUserBadges(user.id);

    // Remove password from response
    const { password_hash, ...userResponse } = user;
    userResponse.badges = badges;

    res.json({
      message: 'Coins updated successfully',
      user: userResponse,
      previousAmount,
      newAmount
    });
  } catch (error) {
    console.error('Update coins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add badge to user
router.post('/:id/badges', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quizId, resultId, title, image, coinValue } = req.body;
    
    // Only allow users to add badges to their own profile
    if (req.user.userId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { badge, isNew, error } = await UserService.addBadgeToUser(id, {
      quizId,
      resultId,
      title,
      image,
      coinValue
    });

    if (error) {
      return res.status(500).json({ error: 'Failed to add badge' });
    }

    // Get updated user
    const { user, error: userError } = await UserService.findUserById(id);
    if (userError) {
      return res.status(500).json({ error: 'Failed to get updated user' });
    }

    // Get user badges
    const { badges } = await UserService.getUserBadges(user.id);

    // Remove password from response
    const { password_hash, ...userResponse } = user;
    userResponse.badges = badges;

    res.json({
      message: isNew ? 'Badge added successfully' : 'Badge updated successfully',
      badge,
      user: userResponse
    });
  } catch (error) {
    console.error('Add badge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;