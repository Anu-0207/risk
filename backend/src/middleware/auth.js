import { verifyToken } from '../utils/jwt.js';
import { db } from '../database.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Authentication token is missing. Please sign in to continue.',
    });
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'Your session has expired or is invalid. Please sign in again.',
    });
  }

  const user = db.findUserById(decoded.id);
  if (!user) {
    return res.status(401).json({
      error: 'USER_NOT_FOUND',
      message: 'Authenticated user profile not found.',
    });
  }

  // Attach safe user object without password hash
  req.user = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at,
  };

  next();
}
