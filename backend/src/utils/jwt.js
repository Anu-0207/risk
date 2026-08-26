import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'risk_vault_jwt_secure_secret_2026';
const JWT_EXPIRES_IN = '7d';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
