// Protects routes (verifies JWT token)
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request to include user data
interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

// Middleware to verify JWT token
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token, authorization denied' });
      return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, secret) as { id: string };

    // Add user to request
    req.user = { id: decoded.id };

    console.log('✅ Auth verified for user:', decoded.id);
    next();

  } catch (error: any) {
    console.error('❌ Auth Middleware Error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(401).json({ error: 'Authorization failed' });
    }
  }
};