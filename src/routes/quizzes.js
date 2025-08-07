import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { QuizService } from '../services/quizService.js';

const router = express.Router();

// Get all quizzes with optional filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, topic, subtopic, type } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (topic) filters.topic = topic;
    if (subtopic) filters.subtopic = subtopic;
    if (type) filters.type = type;

    const { quizzes, error } = await QuizService.getQuizzes(filters);

    if (error) {
      return res.status(500).json({ error: 'Failed to get quizzes' });
    }

    res.json({ 
      quizzes,
      total: quizzes.length 
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { quiz, error } = await QuizService.getQuizById(id);
    
    if (error) {
      if (error === 'Quiz has expired') {
        return res.status(410).json({ error });
      }
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit quiz result
router.post('/:id/submit', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, result, traits, isGuest = false } = req.body;
    
    const submissionData = {
      userId: req.user?.userId || null,
      quizId: id,
      resultId: result.id,
      answers,
      traits,
      isGuest: isGuest || !req.user,
      userAgent: req.get('User-Agent')
    };

    const { result: quizResult, coinsEarned, submission, error } = await QuizService.submitQuiz(submissionData);

    if (error) {
      if (error === 'Quiz not found') {
        return res.status(404).json({ error });
      }
      if (error === 'Quiz has expired') {
        return res.status(410).json({ error });
      }
      if (error === 'Invalid result') {
        return res.status(400).json({ error });
      }
      return res.status(500).json({ error: 'Failed to submit quiz' });
    }

    const response = {
      message: submissionData.isGuest ? 'Quiz completed as guest' : 'Quiz result submitted successfully',
      result: quizResult,
      coinsEarned,
      isGuest: submissionData.isGuest
    };

    if (submission) {
      response.submission = submission;
    }

    res.json(response);
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { stats, error } = await QuizService.getQuizStats(id);
    
    if (error) {
      return res.status(500).json({ error: 'Failed to get quiz stats' });
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get topics
router.get('/meta/topics', async (req, res) => {
  try {
    const { topics, error } = await QuizService.getTopics();

    if (error) {
      return res.status(500).json({ error: 'Failed to get topics' });
    }

    res.json({ topics });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new quiz (for creators only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Check if user can create quizzes (only lucasfeliciano for now)
    const { user } = await UserService.findUserById(req.user.userId);
    if (!user || user.username !== 'lucasfeliciano') {
      return res.status(403).json({ error: 'Only authorized users can create quizzes' });
    }

    const { quiz, error } = await QuizService.createQuiz(req.body, req.user.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to create quiz' });
    }

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update quiz (for creators only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quiz, error } = await QuizService.updateQuiz(id, req.body, req.user.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to update quiz' });
    }

    res.json({
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;