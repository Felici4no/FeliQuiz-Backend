import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT tokens
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'NO_TOKEN'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured');
      return res.status(500).json({ 
        error: 'Server configuration error',
        code: 'CONFIG_ERROR'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('Token verification error:', err);
        
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            error: 'Token has expired',
            code: 'TOKEN_EXPIRED'
          });
        }
        
        if (err.name === 'JsonWebTokenError') {
          return res.status(403).json({ 
            error: 'Invalid token',
            code: 'INVALID_TOKEN'
          });
        }
        
        return res.status(403).json({ 
          error: 'Token verification failed',
          code: 'TOKEN_ERROR'
        });
      }
      
      console.log('✅ Token verified for user:', user.username);
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (!err) {
          req.user = user;
        }
        // Don't fail if token is invalid in optional auth
      });
    }
    
    next();
  } catch (error) {
    // Don't fail on optional auth errors
    console.warn('Optional auth error:', error);
    next();
  }
};

// Middleware to check if user can create quizzes
export const requireCreatorPermission = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // For now, only lucas_feliciano can create quizzes
    // In the future, this could be expanded to check a creators table
    const allowedCreators = ['lucas_feliciano', 'lucasfeliciano'];
    
    if (!allowedCreators.includes(req.user.username)) {
      return res.status(403).json({ 
        error: 'Creator permission required',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  } catch (error) {
    console.error('Creator permission check error:', error);
    res.status(500).json({ error: 'Permission check failed' });
  }
};

// Rate limiting middleware for auth endpoints
export const authRateLimit = (req, res, next) => {
  // This would typically use a more sophisticated rate limiting solution
  // For now, we'll rely on the global rate limiter
  next();
};