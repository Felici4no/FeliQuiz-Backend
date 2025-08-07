import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { ManifestoService } from '../services/manifestoService.js';

const router = express.Router();

// Get manifesto likes count
router.get('/likes', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.userId || null;
    const { totalLikes, hasLiked, error } = await ManifestoService.getLikesInfo(userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to get likes info' });
    }
    
    res.json({ 
      totalLikes,
      hasLiked
    });
  } catch (error) {
    console.error('Get manifesto likes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle like on manifesto (requires authentication)
router.post('/like', authenticateToken, async (req, res) => {
  try {
    const { totalLikes, hasLiked, error } = await ManifestoService.toggleLike(req.user.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to toggle like' });
    }

    res.json({
      message: 'Like toggled successfully',
      totalLikes,
      hasLiked
    });
  } catch (error) {
    console.error('Toggle manifesto like error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if user has liked manifesto
router.get('/like/status', authenticateToken, async (req, res) => {
  try {
    const { totalLikes, hasLiked, error } = await ManifestoService.getLikesInfo(req.user.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to get like status' });
    }
    
    res.json({ 
      hasLiked,
      totalLikes 
    });
  } catch (error) {
    console.error('Get like status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;