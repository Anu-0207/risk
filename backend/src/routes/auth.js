import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database.js';
import { generateToken } from '../utils/jwt.js';
import { validateRegistration, validateEmail } from '../utils/validators.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { full_name, email, password, confirm_password } = req.body;

    const validation = validateRegistration({
      full_name,
      email,
      password,
      confirm_password,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: 'VALIDATION_FAILED',
        message: validation.errors[0],
        errors: validation.errors,
      });
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'DUPLICATE_ACCOUNT',
        message: 'An account with this email address already exists. Please sign in instead.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
    };

    db.createUser(newUser);

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
    });

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        created_at: newUser.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Please provide both email and password.',
      });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'AUTH_FAILED',
        message: 'Incorrect email or password. Please try again.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        error: 'AUTH_FAILED',
        message: 'Incorrect email or password. Please try again.',
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    });

    return res.json({
      message: 'Signed in successfully.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  return res.json({ message: 'Signed out successfully.' });
});

export default router;
