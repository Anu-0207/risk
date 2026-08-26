import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';
import { runLocalRiskAnalysis } from '../services/localRiskEngine.js';
import { analyzeWithOpenAI, analyzeWithGemini } from '../services/openaiAnalyzer.js';
import { calculateRiskScore } from '../utils/riskCalculator.js';

const router = express.Router();

router.use(authenticateToken);

// POST /api/analyze-risk
router.post('/analyze-risk', async (req, res, next) => {
  try {
    const { input } = req.body;

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return res.status(400).json({
        error: 'EMPTY_INPUT',
        message: 'Please enter content to analyze.',
      });
    }

    const cleanInput = input.trim();

    // 1. Run Local Deterministic Risk Engine
    const localResult = runLocalRiskAnalysis(cleanInput);

    let aiResult = null;
    let engineUsed = 'Local Deterministic Risk Engine';
    let aiErrorNotice = null;

    // 2. Attempt OpenAI Contextual Analysis first if configured
    if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('MY_OPENAI_KEY')) {
      try {
        aiResult = await analyzeWithOpenAI(cleanInput);
        engineUsed = aiResult.analysis_engine || 'OpenAI GPT-4o Engine';
      } catch (err) {
        console.warn('OpenAI analysis unavailable, attempting Gemini contextual fallback:', err.message);
      }
    }

    // 3. Fallback to Gemini if OpenAI was not available or failed
    if (!aiResult && process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('MY_GEMINI_KEY')) {
      try {
        aiResult = await analyzeWithGemini(cleanInput);
        engineUsed = aiResult.analysis_engine || 'Google Gemini 3.7 Contextual Engine';
      } catch (err) {
        console.warn('Gemini contextual analysis unavailable:', err.message);
        aiErrorNotice = 'Cloud AI contextual analyzer was temporarily unreachable. Assessment generated using Local Deterministic Risk Engine.';
      }
    } else if (!aiResult) {
      aiErrorNotice = 'OpenAI API key not configured. Assessment generated using Local Deterministic Risk Engine.';
    }

    // 4. Synthesize Category Scores & Threats
    let mergedCategories = {
      privacy: localResult.privacy,
      security: localResult.security,
      hallucination: localResult.hallucination,
      bias: localResult.bias,
      compliance: localResult.compliance,
      fraud: localResult.fraud,
    };

    let allThreats = [...localResult.threats];
    let allRecommendations = [...localResult.recommendations];
    let summary = 'Local risk inspection completed across privacy, injection patterns, cybersecurity vulnerabilities, and fraud heuristics.';

    if (aiResult) {
      // Blend AI scores with local deterministic findings (taking the highest risk detection for safety)
      if (aiResult.categories) {
        mergedCategories = {
          privacy: Math.max(localResult.privacy, Number(aiResult.categories.privacy) || 0),
          security: Math.max(localResult.security, Number(aiResult.categories.security) || 0),
          hallucination: Math.max(localResult.hallucination, Number(aiResult.categories.hallucination) || 0),
          bias: Math.max(localResult.bias, Number(aiResult.categories.bias) || 0),
          compliance: Math.max(localResult.compliance, Number(aiResult.categories.compliance) || 0),
          fraud: Math.max(localResult.fraud, Number(aiResult.categories.fraud) || 0),
        };
      }

      if (aiResult.summary) {
        summary = aiResult.summary;
      }

      // Add AI-detected threats
      if (Array.isArray(aiResult.threats)) {
        aiResult.threats.forEach((t, idx) => {
          allThreats.push({
            id: `ai_threat_${Date.now()}_${idx}`,
            threat: t.threat || 'Flagged AI Risk Factor',
            category: t.category || 'Security',
            severity: t.severity || 'Medium',
            evidence: t.evidence || 'Identified during contextual token inspection.',
            explanation: t.explanation || 'Analyzed as a potential reliability or compliance concern.',
            status: 'Open',
          });
        });
      }

      // Add AI-generated recommendations
      if (Array.isArray(aiResult.recommendations)) {
        aiResult.recommendations.forEach((r, idx) => {
          allRecommendations.push({
            id: `ai_rec_${Date.now()}_${idx}`,
            title: r.title || 'Mitigation Guideline',
            description: r.description || 'Apply standard guardrails to sanitize input.',
            resolved: false,
            priority: r.priority || 'Medium',
          });
        });
      }
    }

    // Deduplicate recommendations by title
    const uniqueRecsMap = new Map();
    allRecommendations.forEach((r) => {
      if (!uniqueRecsMap.has(r.title.toLowerCase())) {
        uniqueRecsMap.set(r.title.toLowerCase(), r);
      }
    });
    const finalRecommendations = Array.from(uniqueRecsMap.values());

    // 5. Final Risk Calculation
    const calculated = calculateRiskScore(mergedCategories);

    // 6. Persist to Database
    const newScan = {
      id: 'scn_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
      user_id: req.user.id,
      input: cleanInput,
      risk_score: calculated.overallScore,
      risk_level: calculated.riskLevel,
      trust_index: calculated.trustIndex,
      summary,
      analysis_engine: engineUsed,
      privacy: calculated.categories.privacy,
      security: calculated.categories.security,
      hallucination: calculated.categories.hallucination,
      bias: calculated.categories.bias,
      compliance: calculated.categories.compliance,
      fraud: calculated.categories.fraud,
      threats: allThreats,
      recommendations: finalRecommendations,
      created_at: new Date().toISOString(),
    };

    db.createScan(newScan);

    return res.status(201).json({
      success: true,
      scan: newScan,
      engine: engineUsed,
      notice: aiErrorNotice,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/scans
router.get('/', (req, res, next) => {
  try {
    const scans = db.getScansByUserId(req.user.id);
    return res.json({ scans });
  } catch (err) {
    next(err);
  }
});

// GET /api/scans/:id
router.get('/:id', (req, res, next) => {
  try {
    const scan = db.getScanByIdAndUserId(req.params.id, req.user.id);
    if (!scan) {
      return res.status(404).json({
        error: 'SCAN_NOT_FOUND',
        message: 'Risk assessment not found or access unauthorized.',
      });
    }
    return res.json({ scan });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/scans/:id
router.delete('/:id', (req, res, next) => {
  try {
    const deleted = db.deleteScanByIdAndUserId(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({
        error: 'SCAN_NOT_FOUND',
        message: 'Risk assessment not found or access unauthorized.',
      });
    }
    return res.json({ message: 'Risk assessment deleted successfully.', id: req.params.id });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/scans/:id/recommendations/:recId
router.patch('/:id/recommendations/:recId', (req, res, next) => {
  try {
    const { resolved } = req.body;
    const updated = db.updateScanRecommendations(req.params.id, req.user.id, req.params.recId, Boolean(resolved));
    if (!updated) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Scan or recommendation not found.' });
    }
    return res.json({ message: 'Recommendation updated.', scan: updated });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/scans/:id/threats/:threatId
router.patch('/:id/threats/:threatId', (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = db.updateScanThreatStatus(req.params.id, req.user.id, req.params.threatId, String(status));
    if (!updated) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Scan or threat not found.' });
    }
    return res.json({ message: 'Threat status updated.', scan: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
