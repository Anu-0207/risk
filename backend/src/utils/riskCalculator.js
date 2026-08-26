/**
 * Risk Calculator for RiskVault
 * Formulas:
 * Risk Score = Privacy * 0.20 + Security * 0.25 + Hallucination * 0.15 + Bias * 0.10 + Compliance * 0.15 + Fraud * 0.15
 * Trust Index = 100 - Risk Score
 *
 * Risk Levels:
 * 0–20 = LOW
 * 21–50 = MODERATE
 * 51–75 = HIGH
 * 76–100 = CRITICAL
 */

export function calculateRiskScore(categories) {
  const privacy = Math.min(100, Math.max(0, Number(categories.privacy) || 0));
  const security = Math.min(100, Math.max(0, Number(categories.security) || 0));
  const hallucination = Math.min(100, Math.max(0, Number(categories.hallucination) || 0));
  const bias = Math.min(100, Math.max(0, Number(categories.bias) || 0));
  const compliance = Math.min(100, Math.max(0, Number(categories.compliance) || 0));
  const fraud = Math.min(100, Math.max(0, Number(categories.fraud) || 0));

  const rawScore = (
    privacy * 0.20 +
    security * 0.25 +
    hallucination * 0.15 +
    bias * 0.10 +
    compliance * 0.15 +
    fraud * 0.15
  );

  const overallScore = Math.round(rawScore);
  const trustIndex = Math.max(0, 100 - overallScore);

  let riskLevel = 'LOW';
  if (overallScore > 75) {
    riskLevel = 'CRITICAL';
  } else if (overallScore > 50) {
    riskLevel = 'HIGH';
  } else if (overallScore > 20) {
    riskLevel = 'MODERATE';
  } else {
    riskLevel = 'LOW';
  }

  return {
    overallScore,
    riskLevel,
    trustIndex,
    categories: {
      privacy,
      security,
      hallucination,
      bias,
      compliance,
      fraud,
    },
  };
}
