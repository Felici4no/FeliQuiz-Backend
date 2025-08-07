import { supabase } from '../config/database.js';

export class ManifestoService {
  // Get total likes count
  static async getTotalLikes() {
    try {
      const { count, error } = await supabase
        .from('manifesto_likes')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      return { totalLikes: count || 0, error: null };
    } catch (error) {
      console.error('Get total likes error:', error);
      return { totalLikes: 0, error: error.message };
    }
  }

  // Check if user has liked
  static async hasUserLiked(userId) {
    try {
      const { data, error } = await supabase
        .from('manifesto_likes')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { hasLiked: !!data, error: null };
    } catch (error) {
      console.error('Check user liked error:', error);
      return { hasLiked: false, error: error.message };
    }
  }

  // Toggle like
  static async toggleLike(userId) {
    try {
      // Check if user already liked
      const { hasLiked, error: checkError } = await this.hasUserLiked(userId);
      if (checkError) {
        throw new Error(checkError);
      }

      if (hasLiked) {
        // Remove like
        const { error: deleteError } = await supabase
          .from('manifesto_likes')
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          throw deleteError;
        }
      } else {
        // Add like
        const { error: insertError } = await supabase
          .from('manifesto_likes')
          .insert({ user_id: userId });

        if (insertError) {
          throw insertError;
        }
      }

      // Get updated total
      const { totalLikes, error: totalError } = await this.getTotalLikes();
      if (totalError) {
        throw new Error(totalError);
      }

      return {
        totalLikes,
        hasLiked: !hasLiked,
        error: null
      };
    } catch (error) {
      console.error('Toggle like error:', error);
      return { totalLikes: 0, hasLiked: false, error: error.message };
    }
  }

  // Get likes info for user
  static async getLikesInfo(userId = null) {
    try {
      const { totalLikes, error: totalError } = await this.getTotalLikes();
      if (totalError) {
        throw new Error(totalError);
      }

      let hasLiked = false;
      if (userId) {
        const { hasLiked: userLiked, error: likedError } = await this.hasUserLiked(userId);
        if (likedError) {
          throw new Error(likedError);
        }
        hasLiked = userLiked;
      }

      return {
        totalLikes,
        hasLiked,
        error: null
      };
    } catch (error) {
      console.error('Get likes info error:', error);
      return { totalLikes: 0, hasLiked: false, error: error.message };
    }
  }
}