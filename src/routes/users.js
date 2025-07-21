import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { mockUsers } from '../data/mockData.js';

const router = express.Router();

// Get user profile by username
router.get('/:username', (req, res) => {
  try {
    const { username } = req.params;
    const user = mockUsers.find(u => u.username === username);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive information
    const { password: _, email: __, ...userProfile } = user;
    
    res.json({ user: userProfile });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const userIndex = mockUsers.findIndex(u => u.id === req.user.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    if (name) mockUsers[userIndex].name = name;
    if (profilePicture) mockUsers[userIndex].profilePicture = profilePicture;
    
    mockUsers[userIndex].updatedAt = new Date().toISOString();

    const { password: _, ...userResponse } = mockUsers[userIndex];
    
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;