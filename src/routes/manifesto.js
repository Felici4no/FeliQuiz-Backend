import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mock data for manifesto likes
let manifestoData = {
  likes: 1247,
  userLikes: new Set() // In real app, this would be in database
};

// Get manifesto likes
router.get('/likes', (req, res) => {
  try {
    res.json({ 
      likes: manifestoData.likes,
      totalLikes: manifestoData.likes 
    });
  } catch (error) {
    console.error('Get manifesto likes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle like on manifesto
router.post('/like', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    
    if (manifestoData.userLikes.has(userId)) {
      // Remove like
      manifestoData.userLikes.delete(userId);
      manifestoData.likes--;
    } else {
      // Add like
      manifestoData.userLikes.add(userId);
      manifestoData.likes++;
    }

    res.json({
      message: 'Like toggled successfully',
      likes: manifestoData.likes,
      hasLiked: manifestoData.userLikes.has(userId)
    });
  } catch (error) {
    console.error('Toggle manifesto like error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if user has liked manifesto
router.get('/like/status', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const hasLiked = manifestoData.userLikes.has(userId);
    
    res.json({ 
      hasLiked,
      likes: manifestoData.likes 
    });
  } catch (error) {
    console.error('Get like status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;