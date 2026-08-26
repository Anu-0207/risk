import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// GET /api/analytics
router.get('/', (req, res, next) => {
  try {
    const scans = db.getScansByUserId(req.user.id);

    if (!scans || scans.length === 0) {
      return res.json({
        hasData: false,
        totalScans: 0,
        averageRiskScore: 0,
        averageTrustIndex: 100,
        riskTrend: [],
        threatDistribution: [],
        categoryRisk: [
          { category: 'Privacy', score: 0 },
          { category: 'Security', score: 0 },
          { category: 'Hallucination', score: 0 },
          { category: 'Bias', score: 0 },
          { category: 'Compliance', score: 0 },
          { category: 'Fraud', score: 0 },
        ],
        scanActivity: [],
        severityCounts: { Low: 0, Moderate: 0, High: 0, Critical: 0 },
      });
    }

    const totalScans = scans.length;
    const avgRisk = Math.round(scans.reduce((acc, s) => acc + s.risk_score, 0) / totalScans);
    const avgTrust = Math.max(0, 100 - avgRisk);

    // 1. Risk Trend (chronological order)
    const chronologicalScans = [...scans].reverse();
    const riskTrend = chronologicalScans.slice(-15).map((s, index) => ({
      scanNumber: `Scan #${index + 1}`,
      date: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      riskScore: s.risk_score,
      trustIndex: s.trust_index,
      level: s.risk_level,
    }));

    // 2. Category Averages
    const catTotals = {
      privacy: 0,
      security: 0,
      hallucination: 0,
      bias: 0,
      compliance: 0,
      fraud: 0,
    };
    scans.forEach((s) => {
      catTotals.privacy += s.privacy || 0;
      catTotals.security += s.security || 0;
      catTotals.hallucination += s.hallucination || 0;
      catTotals.bias += s.bias || 0;
      catTotals.compliance += s.compliance || 0;
      catTotals.fraud += s.fraud || 0;
    });

    const categoryRisk = [
      { category: 'Privacy', score: Math.round(catTotals.privacy / totalScans), fullMark: 100 },
      { category: 'Security', score: Math.round(catTotals.security / totalScans), fullMark: 100 },
      { category: 'Hallucination', score: Math.round(catTotals.hallucination / totalScans), fullMark: 100 },
      { category: 'Bias', score: Math.round(catTotals.bias / totalScans), fullMark: 100 },
      { category: 'Compliance', score: Math.round(catTotals.compliance / totalScans), fullMark: 100 },
      { category: 'Fraud', score: Math.round(catTotals.fraud / totalScans), fullMark: 100 },
    ];

    // 3. Threat Distribution by Category & Severity
    const threatCatMap = {};
    const severityCounts = { Low: 0, Moderate: 0, High: 0, Critical: 0 };

    scans.forEach((s) => {
      if (s.risk_level === 'CRITICAL') severityCounts.Critical++;
      else if (s.risk_level === 'HIGH') severityCounts.High++;
      else if (s.risk_level === 'MODERATE') severityCounts.Moderate++;
      else severityCounts.Low++;

      if (Array.isArray(s.threats)) {
        s.threats.forEach((t) => {
          const cat = t.category || 'Security';
          threatCatMap[cat] = (threatCatMap[cat] || 0) + 1;
        });
      }
    });

    const threatDistribution = Object.keys(threatCatMap).map((cat) => ({
      name: cat,
      count: threatCatMap[cat],
    }));

    // 4. Scan Activity by day/period
    const activityMap = {};
    scans.forEach((s) => {
      const day = new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      activityMap[day] = (activityMap[day] || 0) + 1;
    });
    const scanActivity = Object.keys(activityMap).slice(-7).map((day) => ({
      date: day,
      scans: activityMap[day],
    }));

    return res.json({
      hasData: true,
      totalScans,
      averageRiskScore: avgRisk,
      averageTrustIndex: avgTrust,
      riskTrend,
      categoryRisk,
      threatDistribution,
      scanActivity,
      severityCounts,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
