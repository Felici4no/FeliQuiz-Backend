import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { mockQuizzes } from '../data/mockData.js';

const router = express.Router();

// Get all quizzes
router.get('/', (req, res) => {
  try {
    const { category, topic, subtopic } = req.query;
    let filteredQuizzes = [...mockQuizzes];

    if (category) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.category === category);
    }

    if (topic) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.topic === topic);
    }

    if (subtopic) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.subtopic === subtopic);
    }

    res.json({ quizzes: filteredQuizzes });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const quiz = mockQuizzes.find(q => q.id === id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit quiz result
router.post('/:id/submit', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { answers, result } = req.body;
    
    const quiz = mockQuizzes.find(q => q.id === id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Here you would typically save the quiz result to database
    // For now, we'll just return success
    
    res.json({
      message: 'Quiz result submitted successfully',
      result,
      coinsEarned: quiz.coinReward
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;