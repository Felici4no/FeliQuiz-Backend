import { supabase } from '../config/database.js';

export class QuizService {
  // Get all quizzes with filters
  static async getQuizzes(filters = {}) {
    try {
      let query = supabase
        .from('quizzes')
        .select(`
          *,
          questions(*,
            question_options(*)
          ),
          quiz_results(*)
        `)
        .eq('is_published', true);

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.topic) {
        query = query.eq('topic', filters.topic);
      }

      if (filters.subtopic) {
        query = query.eq('subtopic', filters.subtopic);
      }

      if (filters.type) {
        const types = filters.type.split(',');
        query = query.in('type', types);
      }

      // Order by creation date
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Filter out expired quizzes
      const now = new Date();
      const activeQuizzes = (data || []).filter(quiz => {
        if (!quiz.expires_at) return true;
        return new Date(quiz.expires_at) > now;
      });

      return { quizzes: activeQuizzes, error: null };
    } catch (error) {
      console.error('Get quizzes error:', error);
      return { quizzes: [], error: error.message };
    }
  }

  // Get quiz by ID
  static async getQuizById(quizId) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          questions(*,
            question_options(*)
          ),
          quiz_results(*)
        `)
        .eq('id', quizId)
        .eq('is_published', true)
        .single();

      if (error) {
        throw error;
      }

      // Check if quiz is expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { quiz: null, error: 'Quiz has expired' };
      }

      return { quiz: data, error: null };
    } catch (error) {
      console.error('Get quiz by ID error:', error);
      return { quiz: null, error: error.message };
    }
  }

  // Submit quiz result
  static async submitQuiz(submissionData) {
    try {
      const { userId, quizId, resultId, answers, traits, isGuest = false } = submissionData;

      // Get quiz to validate
      const { quiz, error: quizError } = await this.getQuizById(quizId);
      if (quizError || !quiz) {
        throw new Error('Quiz not found');
      }

      // Validate result
      const validResult = quiz.quiz_results.find(r => r.id === resultId);
      if (!validResult) {
        throw new Error('Invalid result');
      }

      // For guest users, just return the result
      if (isGuest || !userId) {
        return {
          result: validResult,
          coinsEarned: 0,
          isGuest: true,
          error: null
        };
      }

      // Create submission record
      const { data: submission, error: submissionError } = await supabase
        .from('quiz_submissions')
        .insert({
          user_id: userId,
          quiz_id: quizId,
          result_id: resultId,
          answers,
          traits,
          ip_address: null, // Could be added if needed
          user_agent: submissionData.userAgent || null
        })
        .select()
        .single();

      if (submissionError) {
        throw submissionError;
      }

      // Update quiz taken count
      await supabase
        .from('quizzes')
        .update({ 
          taken_count: quiz.taken_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', quizId);

      return {
        result: validResult,
        coinsEarned: validResult.coin_value,
        submission,
        error: null
      };
    } catch (error) {
      console.error('Submit quiz error:', error);
      return { result: null, error: error.message };
    }
  }

  // Get quiz statistics
  static async getQuizStats(quizId) {
    try {
      // Get total submissions
      const { count: totalSubmissions, error: countError } = await supabase
        .from('quiz_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', quizId);

      if (countError) {
        throw countError;
      }

      // Get result distribution
      const { data: submissions, error: submissionsError } = await supabase
        .from('quiz_submissions')
        .select('result_id, quiz_results(character)')
        .eq('quiz_id', quizId);

      if (submissionsError) {
        throw submissionsError;
      }

      // Calculate distribution
      const resultCounts = {};
      submissions.forEach(sub => {
        const resultId = sub.result_id;
        resultCounts[resultId] = (resultCounts[resultId] || 0) + 1;
      });

      const resultDistribution = Object.entries(resultCounts).map(([resultId, count]) => {
        const submission = submissions.find(s => s.result_id === resultId);
        return {
          resultId,
          character: submission?.quiz_results?.character || 'Unknown',
          count: count,
          percentage: totalSubmissions > 0 ? (count / totalSubmissions) * 100 : 0
        };
      });

      return {
        stats: {
          totalSubmissions: totalSubmissions || 0,
          resultDistribution
        },
        error: null
      };
    } catch (error) {
      console.error('Get quiz stats error:', error);
      return { stats: null, error: error.message };
    }
  }

  // Get topics
  static async getTopics() {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select(`
          *,
          subtopics(*)
        `)
        .order('name');

      if (error) {
        throw error;
      }

      return { topics: data || [], error: null };
    } catch (error) {
      console.error('Get topics error:', error);
      return { topics: [], error: error.message };
    }
  }

  // Create new quiz (for creators)
  static async createQuiz(quizData, creatorId) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          ...quizData,
          created_by: creatorId,
          is_published: false, // Start as draft
          taken_count: 0
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { quiz: data, error: null };
    } catch (error) {
      console.error('Create quiz error:', error);
      return { quiz: null, error: error.message };
    }
  }

  // Update quiz
  static async updateQuiz(quizId, updates, userId) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', quizId)
        .eq('created_by', userId) // Only creator can update
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { quiz: data, error: null };
    } catch (error) {
      console.error('Update quiz error:', error);
      return { quiz: null, error: error.message };
    }
  }
}