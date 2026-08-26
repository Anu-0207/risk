import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';
import { validatePassword } from '../utils/validators.js';

const router = express.Router();

router.use(authenticateToken);

// GET /api/profile
router.get('/', (req, res, next) => {
  try {
    const user = db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'User profile not found.' });
    }

    const scans = db.getScansByUserId(req.user.id);
    const totalScans = scans.length;
    const avgRisk = totalScans > 0
      ? Math.round(scans.reduce((acc, s) => acc + s.risk_score, 0) / totalScans)
      : 0;

    return res.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at,
        stats: {
          totalScans,
          averageRiskScore: avgRisk,
          trustIndex: 100 - avgRisk,
          criticalCount: scans.filter((s) => s.risk_level === 'CRITICAL').length,
          highCount: scans.filter((s) => s.risk_level === 'HIGH').length,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/profile
router.put('/', (req, res, next) => {
  try {
    const { full_name } = req.body;
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Full name cannot be empty.' });
    }

    const updated = db.updateUser(req.user.id, { full_name: full_name.trim() });
    return res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updated.id,
        full_name: updated.full_name,
        email: updated.email,
        created_at: updated.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/profile/password
router.put('/password', async (req, res, next) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Please fill in all password fields.' });
    }

    if (!validatePassword(new_password)) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'New password must be at least 8 characters long.' });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'New passwords do not match.' });
    }

    const user = db.findUserById(req.user.id);
    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'INCORRECT_PASSWORD', message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(new_password, salt);
    db.updateUser(req.user.id, { password_hash: newHash });

    return res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
});

export default router;
